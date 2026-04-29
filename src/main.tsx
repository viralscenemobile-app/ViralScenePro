import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import App from './App.tsx';
import { AuthProvider } from './AuthProvider.tsx';
import './index.css';

const convexUrl = import.meta.env.VITE_CONVEX_URL;
let convex: ConvexReactClient | null = null;
if (convexUrl) {
  convex = new ConvexReactClient(convexUrl);
}

const rootElement = document.getElementById('root')!;

if (convex) {
  createRoot(rootElement).render(
    <StrictMode>
      <ConvexProvider client={convex}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConvexProvider>
    </StrictMode>,
  );
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
