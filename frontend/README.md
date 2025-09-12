# Zeeky Frontend

Modern React dashboard for the Zeeky AI Assistant platform.

## Features

- 🎨 **Modern UI** - Built with React 18, Tailwind CSS, and Framer Motion
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🧩 **Plugin Management** - Visual plugin configuration and monitoring
- 📊 **Analytics Dashboard** - Real-time system metrics and performance monitoring
- ⚙️ **Settings Panel** - Comprehensive configuration options
- 🎯 **TypeScript** - Full type safety and developer experience
- 🧪 **Testing** - Vitest for unit and integration testing

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animation**: Framer Motion
- **Icons**: Heroicons
- **HTTP Client**: Axios
- **State Management**: React Query
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

### Development

The development server runs on `http://localhost:3000` with hot reload enabled.

```bash
npm run dev
```

### Building

Create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main app component
│   └── index.css          # Global styles
├── package.json
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## API Integration

The frontend is configured to proxy API requests to the backend server running on `http://localhost:8000`.

API endpoints:
- `/api/health` - Health check
- `/api/plugins` - Plugin management
- `/api/analytics` - Analytics data
- `/api/settings` - Settings management

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## License

MIT License - see LICENSE file for details