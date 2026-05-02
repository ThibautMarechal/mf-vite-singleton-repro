import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        remote: {
          type: 'module',
          name: 'remote',
          entry: 'http://localhost:5001/remoteEntry.js',
          entryGlobalName: 'remote',
          shareScope: 'default',
        },
      },
      shared: {
        // Explicitly declared as singletons — must never be auto-excluded.
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        // company-sdk lists react in its own dependencies, triggering the bug:
        // excludeSharedSubDependencies sees react as a sub-dep of company-sdk
        // and removes it from shared — despite singleton: true above.
        'company-sdk': { requiredVersion: '*' },
      },
    }),
  ],
});
