import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import App from './App'
import SceneBoundary from './SceneBoundary'
import './styles.css'

// Root-level boundary so a single unexpected throw can never blank the whole
// page to black again — the user gets a readable message and a way to recover
// instead of a dead screen, and the error still lands in the console.
const RootFallback = (
  <div
    role="alert"
    style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: '2rem',
      background: '#050505',
      color: '#f4f1ea',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      gap: '1rem',
    }}
  >
    <div>
      <p style={{ fontSize: '1.1rem', margin: '0 0 0.75rem' }}>Something broke while rendering this page.</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        style={{
          padding: '0.6rem 1.2rem',
          borderRadius: '999px',
          border: '1px solid #f4f1ea',
          background: 'transparent',
          color: '#f4f1ea',
          cursor: 'pointer',
        }}
      >
        Reload
      </button>
    </div>
  </div>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SceneBoundary label="root" fallback={RootFallback}>
      <App />
    </SceneBoundary>
  </StrictMode>,
)
