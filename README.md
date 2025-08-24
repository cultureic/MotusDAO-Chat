# MotusDAO AI Chat

A modern, blockchain-powered AI chat application with native CELO payments, built with Next.js 15, Etherspot Arka paymaster, and Account Abstraction.

## ✨ Features

- **Modern UI/UX**: Glassmorphism design with Framer Motion micro-interactions
- **Blockchain Integration**: Native CELO payments per message
- **Account Abstraction**: ERC-4337 smart accounts with Etherspot Arka
- **Mobile Responsive**: Optimized for all devices
- **Three.js Scenes**: Lightweight decorative 3D elements
- **Accessibility**: WCAG 2.2 AA compliant with reduced motion support

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎨 Theme System

The app supports multiple themes and accessibility features:

### Theme Toggle
- **Dark Theme** (default): Modern dark interface with glassmorphism
- **Light Theme**: Clean light interface
- **High Contrast**: Enhanced accessibility mode

### Motion Preferences
- **Reduced Motion**: Automatically disables animations for users with `prefers-reduced-motion`
- **Performance**: Three.js scenes auto-disable on low-power devices
- **Accessibility**: Full keyboard navigation and screen reader support

### Design Tokens
All colors, spacing, and animations are defined in `styles/tokens.json` and mapped to CSS variables for easy customization.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion with performance optimizations
- **3D Graphics**: Three.js with React Three Fiber
- **Blockchain**: Celo Network, Etherspot Arka, Account Abstraction
- **Authentication**: Privy for wallet integration

## 📱 Mobile Responsive

The interface is fully responsive with:
- Adaptive layouts for mobile, tablet, and desktop
- Touch-friendly interactions
- Optimized performance on mobile devices
- Progressive enhancement

## 🔧 Customization

### Colors & Themes
Edit `styles/tokens.json` to customize:
- Brand colors (brand-300, brand-500, brand-600)
- Accent colors (mint, iris, peach)
- Background and foreground colors
- Border radius and shadow values

### Animations
Modify motion durations in `styles/tokens.json`:
- `fast`: 80ms for quick interactions
- `base`: 160ms for standard animations
- `slow`: 240ms for emphasis

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
