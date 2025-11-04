import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0D1117',
          color: '#fff',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '600px',
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '8px',
            padding: '30px'
          }}>
            <h1 style={{ color: '#f85149', marginBottom: '20px' }}>
              ⚠️ Application Error
            </h1>
            
            <p style={{ marginBottom: '20px', color: '#8b949e' }}>
              Something went wrong. Please try refreshing the page.
            </p>

            {this.state.error && (
              <details style={{ marginBottom: '20px' }}>
                <summary style={{ cursor: 'pointer', color: '#58a6ff', marginBottom: '10px' }}>
                  Error Details
                </summary>
                <pre style={{
                  background: '#0d1117',
                  padding: '15px',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '12px',
                  color: '#f85149'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && '\n\n' + this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: '#238636',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Reload Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  background: '#21262d',
                  color: '#c9d1d9',
                  border: '1px solid #30363d',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Go Home
              </button>
            </div>

            <div style={{
              marginTop: '30px',
              padding: '15px',
              background: '#1a1f2e',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#8b949e'
            }}>
              <strong style={{ color: '#58a6ff' }}>Troubleshooting:</strong>
              <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                <li>Clear your browser cache and cookies</li>
                <li>Try opening in an incognito/private window</li>
                <li>Check your internet connection</li>
                <li>Contact support if the issue persists</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
