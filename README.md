# VU ARABIA - IMVU Automation Frontend

A modern React TypeScript frontend application for VU ARABIA's IMVU automation service. This application provides a clean and intuitive interface for managing bulk social actions on the IMVU platform.

## Features

- **Dashboard**: Overview of automation statistics and recent activities
- **Bulk Like**: Mass-like posts and profiles across multiple accounts
- **Bulk Comment**: Automated commenting on posts with customizable messages
- **Bulk Follow**: Mass follow users with intelligent rate limiting
- **Account Manager**: Manage multiple IMVU accounts (Coming Soon)
- **Analytics**: Detailed performance metrics and reports (Coming Soon)
- **Activity Log**: Real-time tracking of automation activities (Coming Soon)

## Technology Stack

- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **React Router** for client-side navigation
- **Lucide React** for beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
