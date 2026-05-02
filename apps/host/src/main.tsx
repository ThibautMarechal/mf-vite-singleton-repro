import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

const RemoteButton = React.lazy(() => import('remote/Button'));

function App() {
  return (
    <div>
      <h1>Host App</h1>
      <Suspense fallback={<p>Loading remote component...</p>}>
        <RemoteButton />
      </Suspense>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
