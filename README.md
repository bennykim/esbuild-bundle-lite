# esbuild-bundle-lite (EBL)

EBL (esbuild-bundle-lite) is an esbuild-based bundling tool designed for React projects. It provides a lightweight and efficient build process, leveraging the speed of esbuild and the flexibility of custom plugins.

## Overview

This repository contains configuration files and dependencies for quickly starting projects using React.js and esbuild. The primary development content is focused in the `esbuild` folder, while the `src` folder exists for simple testing of esbuild.

Key features:

- Fast bundling with esbuild
- TypeScript support
- CSS Modules support
- Custom plugin system
- Production builds with optimizations

## Project Structure

```
esbuild-bundle-lite/
├── esbuild/           # Main esbuild configuration and plugins
│   ├── plugins/       # Custom esbuild plugins
│   ├── config/        # Configuration files
│   ├── utils/         # Utility functions
│   └── index.ts       # Main entry point for esbuild scripts
├── src/               # Source files for testing esbuild
├── out/               # Compiled output from swc
├── bundle/            # Bundled output (cjs and esm)
├── .swcrc             # SWC configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies and scripts
```

## Getting Started

1. Install dependencies:

   ```shell
   yarn install
   ```

2. Start the development server:

   ```shell
   yarn dev
   ```

   This will compile the esbuild scripts with swc and start the development server.

3. Open your web browser and visit `http://localhost:5173` to see your React application in action.

## Available Scripts

- `yarn dev`: Starts the development server with hot reloading.
- `yarn build`: Builds the production-ready application.
- `yarn bundle`: Prepares the package for publishing, compiling to both CommonJS and ES modules.
- `yarn compile:swc`: Compiles the esbuild scripts using SWC.
- `yarn compile:tsc`: Compiles the project using TypeScript for both CJS and ESM outputs.

## Key Features

1. **Fast Bundling**: Utilizes esbuild for extremely fast bundling and development experience.
2. **TypeScript Support**: Full TypeScript support in both the bundler and the bundled applications.
3. **CSS Modules**: Built-in support for CSS Modules, allowing for scoped styling.
4. **Custom Plugins**: Extensible plugin system for customizing the build process.
5. **Development Server**: Includes a development server with hot reloading for rapid development.
6. **Production Optimization**: Generates optimized builds for production environments.

## Dev Dependencies

- `esbuild`: Fast JavaScript bundler and minifier
- `@swc/core` & `@swc/cli`: Fast TypeScript/JavaScript compiler
- `typescript`: TypeScript language support
- `fs-extra`: Enhanced file system methods
- `nodemon`: Utility for monitoring file changes and restarting the server

## License

This project is open source and available under the [MIT License](LICENSE).
