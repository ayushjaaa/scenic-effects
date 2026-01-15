#!/bin/bash

# ============================================
# Frame Download Script
# Downloads sequential frames from a URL pattern
# ============================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Frame Sequence Downloader${NC}"
echo -e "${GREEN}================================${NC}\n"

# ============================================
# Configuration
# ============================================

BASE_URL=""
OUTPUT_DIR="./frames"
START_FRAME=1
END_FRAME=120
PREFIX="frame_"
PADDING=5
FORMAT="avif"
PARALLEL=4  # Number of parallel downloads

# ============================================
# Parse arguments
# ============================================

print_usage() {
    echo "Usage: ./download-frames.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -u, --url URL          Base URL with {NUM} placeholder (required)"
    echo "  -o, --output DIR       Output directory (default: ./frames)"
    echo "  -s, --start NUMBER     Starting frame number (default: 1)"
    echo "  -e, --end NUMBER       Ending frame number (default: 120)"
    echo "  -p, --prefix TEXT      Filename prefix (default: frame_)"
    echo "  -d, --padding NUMBER   Zero padding (default: 5 for 00001)"
    echo "  -f, --format EXT       File format (default: avif)"
    echo "  -j, --jobs NUMBER      Parallel downloads (default: 4)"
    echo ""
    echo "Examples:"
    echo "  # Download Rotoris-style frames"
    echo "  ./download-frames.sh -u 'https://cdn.shopify.com/path/frame_{NUM}.avif' -e 120"
    echo ""
    echo "  # Custom URL pattern"
    echo "  ./download-frames.sh -u 'https://example.com/img-{NUM}.jpg' -s 1 -e 50 -d 3"
    echo ""
    echo "Note: Use {NUM} in the URL where the frame number should be inserted"
}

while [[ $# -gt 0 ]]; do
    case $1 in
        -u|--url)
            BASE_URL="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        -s|--start)
            START_FRAME="$2"
            shift 2
            ;;
        -e|--end)
            END_FRAME="$2"
            shift 2
            ;;
        -p|--prefix)
            PREFIX="$2"
            shift 2
            ;;
        -d|--padding)
            PADDING="$2"
            shift 2
            ;;
        -f|--format)
            FORMAT="$2"
            shift 2
            ;;
        -j|--jobs)
            PARALLEL="$2"
            shift 2
            ;;
        --help)
            print_usage
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            print_usage
            exit 1
            ;;
    esac
done

# ============================================
# Validation
# ============================================

if [ -z "$BASE_URL" ]; then
    echo -e "${RED}Error: URL is required!${NC}\n"
    print_usage
    exit 1
fi

if [[ ! "$BASE_URL" =~ \{NUM\} ]]; then
    echo -e "${RED}Error: URL must contain {NUM} placeholder${NC}"
    echo "Example: https://example.com/frame_{NUM}.avif"
    exit 1
fi

# Check for required commands
if ! command -v curl &> /dev/null; then
    echo -e "${RED}Error: curl is not installed!${NC}"
    exit 1
fi

# ============================================
# Create output directory
# ============================================

echo -e "${YELLOW}Creating output directory...${NC}"
mkdir -p "$OUTPUT_DIR"

if [ ! -d "$OUTPUT_DIR" ]; then
    echo -e "${RED}Error: Could not create directory '$OUTPUT_DIR'${NC}"
    exit 1
fi

# ============================================
# Display configuration
# ============================================

TOTAL_FRAMES=$((END_FRAME - START_FRAME + 1))

echo -e "${YELLOW}Configuration:${NC}"
echo -e "  Base URL: ${GREEN}${BASE_URL}${NC}"
echo -e "  Output: ${GREEN}${OUTPUT_DIR}${NC}"
echo -e "  Range: ${GREEN}${START_FRAME} to ${END_FRAME}${NC}"
echo -e "  Total frames: ${GREEN}${TOTAL_FRAMES}${NC}"
echo -e "  Format: ${GREEN}${FORMAT}${NC}"
echo -e "  Padding: ${GREEN}${PADDING} digits${NC}"
echo -e "  Parallel jobs: ${GREEN}${PARALLEL}${NC}\n"

# ============================================
# Confirm download
# ============================================

read -p "Continue with download? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Download cancelled.${NC}"
    exit 0
fi

# ============================================
# Download function
# ============================================

download_frame() {
    local frame_num=$1
    local padded_num=$(printf "%0${PADDING}d" $frame_num)
    local url="${BASE_URL//\{NUM\}/$padded_num}"
    local filename="${PREFIX}${padded_num}.${FORMAT}"
    local filepath="${OUTPUT_DIR}/${filename}"

    # Download with curl
    curl -s -o "$filepath" "$url"

    if [ $? -eq 0 ] && [ -f "$filepath" ]; then
        # Check if file has content
        local filesize=$(stat -f%z "$filepath" 2>/dev/null || stat -c%s "$filepath" 2>/dev/null)
        if [ "$filesize" -gt 0 ]; then
            echo "✓ $filename"
            return 0
        else
            echo "✗ $filename (empty)"
            rm -f "$filepath"
            return 1
        fi
    else
        echo "✗ $filename (failed)"
        return 1
    fi
}

export -f download_frame
export BASE_URL OUTPUT_DIR PREFIX PADDING FORMAT

# ============================================
# Download frames
# ============================================

echo -e "\n${YELLOW}Downloading frames...${NC}\n"

SUCCESS_COUNT=0
FAIL_COUNT=0

# Generate sequence and download
for ((i=START_FRAME; i<=END_FRAME; i++)); do
    if download_frame $i; then
        ((SUCCESS_COUNT++))
    else
        ((FAIL_COUNT++))
    fi

    # Progress indicator
    PROGRESS=$(( (i - START_FRAME + 1) * 100 / TOTAL_FRAMES ))
    printf "\rProgress: ${PROGRESS}%%"
done

echo -e "\n"

# ============================================
# Summary
# ============================================

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Download Complete!${NC}"
echo -e "${GREEN}================================${NC}\n"

echo -e "  Success: ${GREEN}${SUCCESS_COUNT}${NC}"
echo -e "  Failed: ${RED}${FAIL_COUNT}${NC}"
echo -e "  Total: ${TOTAL_FRAMES}\n"

# Calculate total size
if [ -d "$OUTPUT_DIR" ]; then
    TOTAL_SIZE=$(du -sh "$OUTPUT_DIR" | cut -f1)
    echo -e "  Total size: ${GREEN}${TOTAL_SIZE}${NC}\n"
fi

echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update avif-sequence.js CONFIG:"
echo "   - totalFrames: $SUCCESS_COUNT"
echo "   - imageFormat: '$FORMAT'"
echo "   - imagePrefix: '${PREFIX}'"
echo "   - paddingZeros: $PADDING"
echo "2. Open avif-sequence.html in your browser"

if [ $FAIL_COUNT -gt 0 ]; then
    echo -e "\n${YELLOW}⚠️  Warning: Some frames failed to download${NC}"
    echo "Check the URLs and try again, or adjust the range."
fi
