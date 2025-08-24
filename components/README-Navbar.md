# Rounded Transparent Navbar Components

This directory contains modern, glassmorphism-style navbar components with rounded corners and transparency effects.

## Components

### 1. RoundedTransparentNavbar.tsx
**Full-featured version with Framer Motion animations**

Features:
- ✨ Glassmorphism design with backdrop blur
- 🎯 Rounded corners throughout
- ⚡ Smooth animations powered by Framer Motion
- 📱 Responsive mobile menu
- 🎨 Dynamic transparency based on scroll
- 🎭 Hover and tap animations

### 2. SimpleRoundedNavbar.tsx
**Lightweight version without Framer Motion**

Features:
- ✨ Glassmorphism design with backdrop blur
- 🎯 Rounded corners throughout
- ⚡ CSS-only animations and transitions
- 📱 Responsive mobile menu
- 🎨 Dynamic transparency based on scroll
- 🎭 Hover effects

## Usage

### Basic Usage

```tsx
import RoundedTransparentNavbar from './components/RoundedTransparentNavbar';
// or
import SimpleRoundedNavbar from './components/SimpleRoundedNavbar';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <RoundedTransparentNavbar />
      {/* Your content here */}
    </div>
  );
}
```

### Customizing Menu Items

You can customize the menu items by modifying the `menuItems` array in the component:

```tsx
const menuItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/about', label: 'About', icon: 'ℹ️' },
  { href: '/contact', label: 'Contact', icon: '📧' },
  // Add more items as needed
];
```

### Styling Customization

The navbar uses Tailwind CSS classes and can be customized by modifying the className props. Key styling features:

- **Background**: Uses `backdrop-blur-xl` for glassmorphism effect
- **Borders**: `border border-white/20` for subtle borders
- **Shadows**: Dynamic shadows based on scroll state
- **Rounded corners**: `rounded-3xl` for main container, `rounded-2xl` for buttons

## Demo

Visit `/navbar-demo` to see the navbar in action with a beautiful animated background.

## Features

### Glassmorphism Design
- Transparent background with backdrop blur
- Subtle borders and shadows
- Gradient overlays for depth

### Responsive Design
- Desktop: Full horizontal navigation
- Mobile: Collapsible hamburger menu
- Tablet: Adaptive layout

### Scroll Effects
- Transparency changes on scroll
- Shadow intensity increases
- Smooth transitions

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Focus management

### Performance
- Optimized animations
- Efficient re-renders
- Minimal bundle impact

## Dependencies

### RoundedTransparentNavbar
- `framer-motion` (already installed)
- `next/navigation` (for usePathname)
- `react` hooks

### SimpleRoundedNavbar
- No additional dependencies
- Uses only CSS transitions
- Compatible with any React setup

## Browser Support

- Modern browsers with CSS backdrop-filter support
- Graceful degradation for older browsers
- Mobile Safari and Chrome tested

## Customization Tips

1. **Colors**: Modify the gradient classes for different color schemes
2. **Spacing**: Adjust padding and margin classes
3. **Animations**: Tweak transition durations and easing
4. **Icons**: Replace emoji icons with SVG or icon library
5. **Typography**: Customize font weights and sizes

## Examples

### Dark Theme Variant
```tsx
// Add dark: classes for dark mode support
className="bg-white/10 dark:bg-black/10 backdrop-blur-xl"
```

### Custom Brand Colors
```tsx
// Replace gradient colors
className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500"
```

### Different Border Styles
```tsx
// Custom border effects
className="border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
```
