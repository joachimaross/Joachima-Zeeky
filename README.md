# Joachima Zeeky

A React application built with Vite, featuring user authentication and ready for Netlify deployment.

## Features

- ✅ User sign-in screen with placeholder authentication
- ✅ Responsive design
- ✅ Netlify deployment configuration
- ✅ Modern React with Vite build tool
- ✅ ESLint configuration

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Demo Credentials

- Email: `demo@example.com`
- Password: `password`

## Deployment

This project is configured for Netlify deployment with:
- Build command: `npm run build`
- Publish directory: `dist`

## Project Structure

```
├── public/          # Static assets
├── src/
│   ├── components/  # React components
│   │   └── SignIn.jsx
│   ├── App.jsx      # Main app component
│   ├── main.jsx     # Entry point
│   └── index.css    # Global styles
├── netlify.toml     # Netlify configuration
├── package.json     # Dependencies and scripts
└── vite.config.js   # Vite configuration
```

## Security Notes

- Replace placeholder authentication with real backend or OAuth
- Use environment variables for API keys
- Validate all user inputs
- Use HTTPS in production (Netlify provides SSL by default)
