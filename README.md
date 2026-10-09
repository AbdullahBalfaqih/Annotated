# Annotated

Annotated is a cutting-edge, AI-powered platform designed to seamlessly integrate web browsing, video analysis, and community-driven knowledge sharing. At its core, Annotated combines a powerful Chrome Extension (Manifest V3) with a robust Next.js web application, enabling users to summarize web articles, extract insights, and capture video annotations directly from platforms like YouTube.

The platform includes a community feed where researchers and knowledge enthusiasts can share their annotations, interact with posts, and follow other like-minded individuals.

## Table of Contents

- [Features](#features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- **AI-Powered Summarization**: Utilize advanced generative AI models (integrated via Google GenAI) to summarize long-form articles and web pages instantly.
- **Video Annotation & Clipping**: Capture, annotate, and share specific video segments from supported platforms without leaving the browser.
- **Contextual Knowledge Assistant**: Highlight text on any webpage to ask questions, request explanations, or generate insights.
- **Community Feed**: A centralized hub where users can discover trending research tags, view public annotations, like, bookmark, and comment on community posts.
- **Secure Authentication**: End-to-end user authentication and session management ensuring secure access to personal workspaces.
- **Optimized Extension Delivery**: A unified build process that compiles the Next.js application into a static export and seamlessly bundles it with the Chrome Extension Service Worker and content scripts.

## Architecture & Tech Stack

Annotated follows a decoupled architecture, ensuring scalability and maintainability:

- **Frontend Application**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion, and GSAP for highly interactive UI components.
- **Browser Extension**: Chrome Extension Manifest V3, utilizing background service workers and content scripts isolated from the main page DOM.
- **Backend Infrastructure**: Node.js/Express.js RESTful API handling business logic and data persistence.
- **Database**: PostgreSQL / Supabase integration for reliable and scalable data storage.
- **AI Integration**: Custom integrations with transformer models and `@google/genai` for NLP and text analysis capabilities.

## Prerequisites

Ensure you have the following installed on your local development environment:

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://npmjs.com/) (v9.0.0 or higher)
- A modern Chromium-based browser (Google Chrome, Microsoft Edge, Brave) for extension development.

## Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-organization/annotated.git
   cd annotated
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory and configure the required environment variables:
   ```env
   # API Configuration
   PORT=5000
   
   # Database Configuration
   DATABASE_URL=your_database_connection_string
   
   # AI Services Configuration
   GEMINI_API_KEY=your_gemini_api_key
   
   # Authentication Secrets
   JWT_SECRET=your_secure_jwt_secret
   ```

## Running the Project

The project consists of multiple environments that need to be run concurrently during development.

**1. Start the Backend API Server**
```bash
npm run server
```
The server will start on `http://localhost:5000`.

**2. Start the Frontend Development Server**
```bash
npm run dev
```
The web application will be accessible at `http://localhost:3000`.

## Building for Production

Annotated utilizes a custom build script that compiles the Next.js application, optimizes assets, and bundles the Chrome extension into a single output directory.

**Generate the Production Build:**
```bash
npm run build
```

This command will:
1. Clean old build artifacts.
2. Generate a Next.js Static Export.
3. Resolve Next.js reserved prefixes (`_next`) to comply with Chrome Extension policies.
4. Bundle the background service worker and content scripts via ESBuild.
5. Output the ready-to-use unpacked extension into the `out/` and `dist/` directories.

**To load the extension in Chrome:**
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner.
3. Click "Load unpacked" and select the generated `out/` or `dist/` directory.

## Project Structure

```text
annotated/
├── server/                 # Express.js backend, routing, and database schemas
├── src/
│   ├── app/                # Next.js Application Router (Pages, Layouts, API routes)
│   ├── components/         # Reusable React components
│   ├── icons/              # Chrome Extension assets and branding
│   ├── content.js          # Extension Content Script injected into web pages
│   ├── background.js       # Extension Service Worker
│   ├── popup.js            # Extension Popup logic
│   └── popup.html          # Extension Popup Interface
├── public/                 # Static assets (images, fonts)
├── build.js                # Custom build pipeline for the extension
├── next.config.mjs         # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Project dependencies and scripts
```

## License

This project is licensed under the ISC License.
