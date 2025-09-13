# ProfGini Platform

The AI Discussion Response Generator is a Next.js 13 application designed to assist professors in generating responses to student discussions. The project is built using Radix UI for customizable and accessible UI components, and Tailwind CSS for efficient styling.

## Table of Contents

- [ProfGini Platform](#profgini-platform)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Create your first use in your local setup](#create-your-first-use-in-your-local-setup)
  - [Project Structure](#project-structure)
  - [Pages and Components](#pages-and-components)
    - [App Directory](#app-directory)
    - [Components](#components)
  - [API Routes](#api-routes)
    - [Chat Route](#chat-route)
  - [Styling](#styling)
  - [Configuration](#configuration)
  - [License](#license)

## Features

- Next.js 13 App Directory structure
- Radix UI Primitives for accessible and customizable UI components
- Tailwind CSS for efficient styling
- Icons from [Lucide](https://lucide.dev)
- Dark mode support with `next-themes`
- Tailwind CSS class sorting, merging, and linting

## Getting Started

### Prerequisites

- Node.js (version 12 or higher)
- pnpm package manager
- prisma cli

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YanniKouloumbis/profhelp.git
   ```
2. Navigate to the project directory:
   ```bash
   cd profhelp
   ```
3. Install the dependencies:
   ```bash
   pnpm install
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```
5. Init your prisma client:
   ```bash
   pnpm prisma:generate
   ```
6. Run prisma migrations
   ```bash
   pnpm migration:postgres:local
   ```
7. Open your browser and visit `http://localhost:3000` to see the application running.

### Create your first use in your local setup

1. Go to `app/api/auth/[...nextauth]/route.ts`
2. Edit the signIn function to look like this:
   ```bash
   async signIn({ user, account, profile, email, credentials }) {
    return true
   }
   ```
3. Log into the app at `http://localhost:3000`
4. Roll back your changes, an try to login with the same email you use in the previous step.

## Project Structure

The project follows the Next.js 13 App Directory structure. Here's an overview of the main directories and files:

- `app/`: Contains the application routes and pages.
  - `api/`: Holds the API routes.
    - `chat/`: Contains the chat API route.
- `components/`: Includes reusable components used throughout the application.
  - `ui/`: Contains UI-specific components.
- `config/`: Stores configuration files.
- `lib/`: Holds utility functions and libraries.
- `public/`: Contains static assets such as images and favicon.
- `styles/`: Includes global and component-specific CSS styles.
- `types/`: Defines TypeScript types used in the application.

## Pages and Components

### App Directory

The `app/` directory contains the main application pages and layouts. Here are the key files:

- `layout.tsx`: Defines the overall layout of the application, including the main navigation and site header.
- `page.tsx`: Represents the home page of the application, where users can input their discussion prompts and generate AI responses.

### Components

The `components/` directory contains reusable components used throughout the application. Some notable components include:

- `discussion-response.tsx`: Displays the generated AI discussion response to the user.
- `main-nav.tsx`: Represents the main navigation of the application, allowing users to navigate between different pages.
- `site-header.tsx`: Renders the header section of the application, typically including the logo and site title.
- `theme-toggle.tsx`: Allows users to switch between light and dark themes.
- `ui/`: Contains UI-specific components such as buttons, inputs, labels, and textareas. These components are built using Radix UI primitives and can be easily customized and reused.

## API Routes

### Chat Route

The `app/api/chat/route.ts` file defines the API route for handling chat-related requests. It is responsible for processing incoming requests, generating AI-powered discussion responses, and sending the responses back to the client.

## Styling

The project uses Tailwind CSS for styling. The `styles/globals.css` file contains global styles and Tailwind CSS directives. It defines custom color classes, dark mode styles, and base styles for the application.

## Configuration

The project includes configuration files for various tools and libraries used:

- `postcss.config.js`: Contains the PostCSS configuration, including the Tailwind CSS and Autoprefixer plugins.
- `prettier.config.js`: Defines the Prettier configuration for code formatting.
- `tailwind.config.js`: Contains the Tailwind CSS configuration, including theme customization, content paths, and plugin settings.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
