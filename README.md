# 🚴 Yoke Height Calculator

A modern, TypeScript-powered web application for calculating precise bike yoke heights. Built with modern web technologies and featuring an intuitive, responsive design.

## ✨ Features

- **🎯 Precision Calculations**: Calculate optimal yoke heights based on your specific bike configuration
- **📱 Responsive Design**: Beautiful, mobile-first design that works on all devices
- **🎨 Interactive Diagram**: Drag-and-drop interface for real-time height adjustments
- **⚡ Modern Tech Stack**: Built with TypeScript, Vite, and modern CSS
- **🔍 Form Validation**: Real-time validation with helpful error messages
- **🌙 Dark Mode**: Automatic dark mode support based on system preferences
- **⚡ Fast Development**: Hot module replacement for instant feedback

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd yokemup

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Technology Stack

- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite**: Lightning-fast build tool and development server
- **Modern CSS**: Custom CSS with CSS Grid, Flexbox, and CSS Custom Properties
- **ES Modules**: Modern JavaScript module system
- **Web APIs**: Fetch API, DOM manipulation, and touch events

## 📁 Project Structure

```
src/
├── app.ts          # Main application logic
├── calculator.ts   # Calculation engine
├── diagram.ts      # Interactive diagram component
├── validator.ts    # Form validation utilities
├── types.ts        # TypeScript type definitions
├── styles.css      # Modern CSS styles
├── index.html      # HTML template
└── data/
    └── heights.json # Bike configuration data
```

## 🎨 Design Features

- **Glass Morphism**: Beautiful frosted glass effects with backdrop filters
- **Gradient Backgrounds**: Smooth color transitions and modern aesthetics
- **Micro-interactions**: Hover effects, smooth transitions, and visual feedback
- **Typography**: Inter font family for excellent readability
- **Color Palette**: Carefully chosen colors with proper contrast ratios
- **Accessibility**: WCAG compliant design with proper focus states

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run TypeScript type checking

### Adding New Bike Configurations

Edit `data/heights.json` to add new bike configurations:

```json
{
  "frame": "Your Frame Model",
  "size": "Size (e.g., 52cm)",
  "tireWidthIn": 2.3,
  "brake": "Brake Type",
  "yoke": "Yoke Type",
  "frontHeightMm": 28,
  "rearHeightMm": 28
}
```

## 🌟 Key Improvements from Original

- **Modern TypeScript**: Replaced vanilla JavaScript with TypeScript for type safety
- **Component Architecture**: Modular design with separate classes for different concerns
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Better UX**: Loading states, error handling, and visual feedback
- **Performance**: Vite build system for fast development and optimized production builds
- **Accessibility**: Better semantic HTML, ARIA labels, and keyboard navigation
- **Modern CSS**: CSS Custom Properties, Grid, and modern layout techniques

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

- [ ] PWA capabilities with offline support
- [ ] Unit and integration tests
- [ ] Animation library integration
- [ ] Export calculations to PDF
- [ ] User preferences storage
- [ ] Multiple measurement units
- [ ] 3D visualization mode

---

Built with ❤️ and modern web technologies

A simple web app to help estimate yoke or cable straddle heights for cantilever brakes.

## Usage

Open `src/index.html` in any modern web browser. Fill out the form with your
frame, tire width, brake and yoke details. The app will display suggested yoke
heights and an interactive diagram where you can drag the yoke position to see
how the height changes.

The calculation is based on a small set of example data. If a specific
combination is not found, a basic formula is used as a fallback.
