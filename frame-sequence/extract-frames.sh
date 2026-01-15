#!/bin/bash

# ============================================
# Frame Extractor Script
# Extracts frames from a video file using FFmpeg
# ============================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Frame Sequence Extractor${NC}"
echo -e "${GREEN}================================${NC}\n"

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}Error: FFmpeg is not installed!${NC}"
    echo "Install it with:"
    echo "  macOS: brew install ffmpeg"
    echo "  Ubuntu: sudo apt-get install ffmpeg"
    echo "  Windows: Download from https://ffmpeg.org/download.html"
    exit 1
fi

# ============================================
# Configuration
# ============================================

# Default values
INPUT_VIDEO=""
OUTPUT_DIR="./frames"
FPS=30
QUALITY=85
WIDTH=1920
HEIGHT=1080
PREFIX="frame_"
FORMAT="jpg"

# ============================================
# Parse arguments
# ============================================

print_usage() {
    echo "Usage: ./extract-frames.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -i, --input FILE       Input video file (required)"
    echo "  -o, --output DIR       Output directory (default: ./frames)"
    echo "  -f, --fps NUMBER       Frames per second to extract (default: 30)"
    echo "  -q, --quality 1-100    JPEG quality (default: 85)"
    echo "  -w, --width PIXELS     Output width (default: 1920)"
    echo "  -h, --height PIXELS    Output height (default: 1080)"
    echo "  -p, --prefix TEXT      Filename prefix (default: frame_)"
    echo "  -t, --format jpg|png   Output format (default: jpg)"
    echo ""
    echo "Examples:"
    echo "  ./extract-frames.sh -i video.mp4"
    echo "  ./extract-frames.sh -i video.mp4 -f 24 -q 90 -w 1280 -h 720"
    echo "  ./extract-frames.sh -i animation.mov -t png -p anim_"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -i|--input)
            INPUT_VIDEO="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        -f|--fps)
            FPS="$2"
            shift 2
            ;;
        -q|--quality)
            QUALITY="$2"
            shift 2
            ;;
        -w|--width)
            WIDTH="$2"
            shift 2
            ;;
        -h|--height)
            HEIGHT="$2"
            shift 2
            ;;
        -p|--prefix)
            PREFIX="$2"
            shift 2
            ;;
        -t|--format)
            FORMAT="$2"
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

if [ -z "$INPUT_VIDEO" ]; then
    echo -e "${RED}Error: Input video file is required!${NC}\n"
    print_usage
    exit 1
fi

if [ ! -f "$INPUT_VIDEO" ]; then
    echo -e "${RED}Error: Input file '$INPUT_VIDEO' not found!${NC}"
    exit 1
fi

# ============================================
# Create output directory
# ============================================

echo -e "${YELLOW}Creating output directory...${NC}"
mkdir -p "$OUTPUT_DIR"

if [ ! -d "$OUTPUT_DIR" ]; then
    echo -e "${RED}Error: Could not create output directory '$OUTPUT_DIR'${NC}"
    exit 1
fi

# ============================================
# Get video information
# ============================================

echo -e "${YELLOW}Analyzing video...${NC}"

DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$INPUT_VIDEO")
TOTAL_FRAMES=$(echo "$DURATION * $FPS" | bc | cut -d. -f1)

echo -e "  Duration: ${GREEN}${DURATION}s${NC}"
echo -e "  Output FPS: ${GREEN}${FPS}${NC}"
echo -e "  Estimated frames: ${GREEN}${TOTAL_FRAMES}${NC}"
echo -e "  Output format: ${GREEN}${FORMAT}${NC}"
echo -e "  Resolution: ${GREEN}${WIDTH}x${HEIGHT}${NC}"
echo -e "  Quality: ${GREEN}${QUALITY}${NC}\n"

# ============================================
# Confirm extraction
# ============================================

read -p "Continue with extraction? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Extraction cancelled.${NC}"
    exit 0
fi

# ============================================
# Extract frames
# ============================================

echo -e "\n${YELLOW}Extracting frames...${NC}"

# Build FFmpeg command based on format
if [ "$FORMAT" = "jpg" ] || [ "$FORMAT" = "jpeg" ]; then
    ffmpeg -i "$INPUT_VIDEO" \
        -vf "fps=$FPS,scale=$WIDTH:$HEIGHT:force_original_aspect_ratio=decrease,pad=$WIDTH:$HEIGHT:(ow-iw)/2:(oh-ih)/2" \
        -q:v $((31 - QUALITY * 31 / 100)) \
        "$OUTPUT_DIR/${PREFIX}%04d.jpg" \
        -hide_banner
elif [ "$FORMAT" = "png" ]; then
    ffmpeg -i "$INPUT_VIDEO" \
        -vf "fps=$FPS,scale=$WIDTH:$HEIGHT:force_original_aspect_ratio=decrease,pad=$WIDTH:$HEIGHT:(ow-iw)/2:(oh-ih)/2" \
        "$OUTPUT_DIR/${PREFIX}%04d.png" \
        -hide_banner
elif [ "$FORMAT" = "webp" ]; then
    ffmpeg -i "$INPUT_VIDEO" \
        -vf "fps=$FPS,scale=$WIDTH:$HEIGHT:force_original_aspect_ratio=decrease,pad=$WIDTH:$HEIGHT:(ow-iw)/2:(oh-ih)/2" \
        -quality $QUALITY \
        "$OUTPUT_DIR/${PREFIX}%04d.webp" \
        -hide_banner
else
    echo -e "${RED}Error: Unsupported format '$FORMAT'${NC}"
    exit 1
fi

# ============================================
# Check results
# ============================================

if [ $? -eq 0 ]; then
    FRAME_COUNT=$(ls -1 "$OUTPUT_DIR" | wc -l | tr -d ' ')

    echo -e "\n${GREEN}✓ Extraction complete!${NC}"
    echo -e "  Frames extracted: ${GREEN}${FRAME_COUNT}${NC}"
    echo -e "  Output directory: ${GREEN}${OUTPUT_DIR}${NC}\n"

    # Calculate total size
    TOTAL_SIZE=$(du -sh "$OUTPUT_DIR" | cut -f1)
    echo -e "  Total size: ${GREEN}${TOTAL_SIZE}${NC}\n"

    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Update frame-sequence.js CONFIG:"
    echo "   - totalFrames: $FRAME_COUNT"
    echo "   - imageFormat: '$FORMAT'"
    echo "   - imagePrefix: '${PREFIX}'"
    echo "2. Open frame-sequence.html in your browser"
else
    echo -e "\n${RED}✗ Extraction failed!${NC}"
    exit 1
fi
