# HeroSection Component - Usage Guide

A reusable hero section component with video background, gradient overlay, and customizable content.

## Features
- ✅ Video background (autoplay, muted, loop)
- ✅ Customizable gradient overlay
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Smooth fade-in animations
- ✅ TypeScript prop validation
- ✅ Fully customizable colors and content

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `videoUrl` | string | ✅ Yes | - | URL of the background video |
| `title` | string | ✅ Yes | - | Main heading text |
| `subtitle` | string | ❌ No | - | Subtitle text (optional) |
| `showGradient` | boolean | ❌ No | `true` | Show/hide gradient overlay |
| `gradientColor` | string | ❌ No | `#4A3621` | Base color for gradient (hex or rgba) |
| `className` | string | ❌ No | `''` | Additional CSS class names |

---

## Usage Examples

### Basic Usage (About Page)
```jsx
import HeroSection from '../components/HeroSection';

const About = () => {
  return (
    <div className="about-page">
      <HeroSection
        videoUrl="https://vod.api.video/vod/vi43oLt7gV47CNleHg4eUxrA/mp4/source.mp4"
        title="About Rotoris"
        subtitle="Become More"
        gradientColor="#4A3621"
      />
      {/* Rest of your content */}
    </div>
  );
};
```

### Custom Gradient Color
```jsx
<HeroSection
  videoUrl="https://example.com/video.mp4"
  title="Our Products"
  subtitle="Precision Meets Performance"
  gradientColor="#1a1a1a"
/>
```

### Without Gradient
```jsx
<HeroSection
  videoUrl="https://example.com/video.mp4"
  title="Welcome"
  subtitle="Experience Excellence"
  showGradient={false}
/>
```

### Without Subtitle
```jsx
<HeroSection
  videoUrl="https://example.com/video.mp4"
  title="Featured Collection"
/>
```

### With Custom Class
```jsx
<HeroSection
  videoUrl="https://example.com/video.mp4"
  title="Hero Title"
  subtitle="Hero Subtitle"
  className="custom-hero-section"
/>
```

### With RGBA Gradient
```jsx
<HeroSection
  videoUrl="https://example.com/video.mp4"
  title="Arvion Collection"
  subtitle="Timeless Design"
  gradientColor="rgba(74, 54, 33, 1)"
/>
```

---

## Gradient Color Format

The `gradientColor` prop accepts hex or rgba colors:

- **Hex:** `#4A3621`
- **RGBA:** `rgba(74, 54, 33, 1)`

The component automatically creates a smooth gradient from solid to transparent:
- 0%: Full opacity
- 20%: Full opacity
- 35%: 85% opacity
- 50%: 70% opacity
- 65%: 50% opacity
- 80%: 30% opacity
- 90%: 10% opacity
- 100%: Transparent

---

## Responsive Behavior

### Desktop (> 1024px)
- Full viewport height (100vh)
- Large title text (3rem max)
- Centered content

### Tablet (769px - 1024px)
- Full viewport height
- Medium title text (2.5rem max)
- Adjusted content position

### Mobile (≤ 768px)
- Full viewport height
- Smaller title text (2rem max)
- Optimized gradient height (20vh)
- Better video positioning

### Small Mobile (≤ 480px)
- Compact gradient (15vh)
- Minimum text sizes
- Extra padding optimization

---

## Styling Customization

You can add custom styles by passing a `className`:

```jsx
<HeroSection
  videoUrl="https://example.com/video.mp4"
  title="Custom Hero"
  className="my-custom-hero"
/>
```

Then in your CSS:
```css
.my-custom-hero {
  height: 80vh; /* Custom height */
}

.my-custom-hero .hero-title {
  color: #gold;
  font-family: 'Custom Font', serif;
}
```

---

## Animation Details

The component includes smooth fade-in animations:

- **Title:** Fades in from bottom (1s duration)
- **Subtitle:** Fades in from bottom (1s duration, 0.3s delay)

The animation creates a professional entrance effect for better user experience.

---

## Video Requirements

For best results, use videos that:
- ✅ Are optimized for web (MP4 format recommended)
- ✅ Have a 16:9 aspect ratio
- ✅ Are under 10MB for faster loading
- ✅ Have appropriate content for autoplay
- ✅ Work well with text overlay

---

## Accessibility

The component automatically includes:
- Proper semantic HTML (`<header>`)
- Video attributes for autoplay (`muted`, `playsInline`)
- Responsive text sizing with `clamp()`
- High contrast text over video

---

## Performance Tips

1. **Optimize Video Size:** Use compressed videos (< 5MB ideal)
2. **Use CDN:** Host videos on a CDN for faster delivery
3. **Lazy Loading:** Consider lazy loading for videos below the fold
4. **Fallback Image:** Add a poster image for slower connections

---

## Example Pages

### Home Page
```jsx
<HeroSection
  videoUrl="https://cdn.example.com/home-hero.mp4"
  title="Welcome to Rotoris"
  subtitle="Where Precision Meets Passion"
/>
```

### Product Page
```jsx
<HeroSection
  videoUrl="https://cdn.example.com/product-hero.mp4"
  title="Arvion Collection"
  subtitle="Limited Edition"
  gradientColor="#2d4a3e"
/>
```

### Contact Page
```jsx
<HeroSection
  videoUrl="https://cdn.example.com/contact-hero.mp4"
  title="Get In Touch"
  subtitle="We'd Love to Hear From You"
  gradientColor="#1a1a1a"
/>
```

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ All modern browsers with video support

---

## License

Part of the Rotoris frontend application.
© 2026 Unikon Innovations Private Limited. All Rights Reserved.
