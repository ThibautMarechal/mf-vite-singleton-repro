import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@module-federation/vite';

export default defineConfig({
  server: { port: 5001 },
  plugins: [
    react(),
    federation({
      name: 'remote',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        'company-sdk': { requiredVersion: '*' },
      },
    }),
  ],
});
