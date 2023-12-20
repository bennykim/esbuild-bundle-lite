# esbuild-bundle-lite

EBL(esbuild-bundle-lite) is an esbuild-based bundling tool for React projects. The primary development content is focused in the esbuild folder, while the src folder exists for simple testing of esbuild.

## Overview

This repository offers configuration files and dependencies for quickly starting projects using React.js and esbuild. TypeScript compilation for testing purposes employs swc.

## Getting Started

1. Install dependencies using your preferred package manager (`yarn`):

   ```shell
   yarn install
   ```

2. Start the development server:

   ```shell
   yarn dev
   ```

3. Open your web browser and visit `http://localhost:3000` to see your React application in action.

## Available Scripts

- `yarn dev`: Starts the development server.
- `yarn build`: Builds the production-ready application.
- `yarn bundle`: Prepares the application for production. It uses tsc to bundle the package in cjs and esm formats for publishing.

## Dependencies

- [esbuild](https://esbuild.github.io/): Fast JavaScript bundler and minifier.
- [React](https://reactjs.org/): JavaScript library for building user interfaces.
- [React DOM](https://reactjs.org/docs/react-dom.html): React package for working with the DOM.
- [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript.
- [swc](https://swc.rs/): A super-fast compiler written in Rust, used for TypeScript compilation.

## Publishing

The package is published as @mniii/ebl.
