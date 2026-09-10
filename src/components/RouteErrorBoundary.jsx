import React from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * RouteErrorBoundary Component
 * Isolates runtime errors to the active route so an issue in one view does not blank the entire app.
 */
export class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Route error boundary caught an exception:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const error = this.state.error;
      const requestId = error?.requestId || null;

      return (
        <div className="card p-8 text-center max-w-lg mx-auto my-12 border border-danger/30 bg-danger/5">
          <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} />
          </div>

          <h2 className="text-base font-bold text-foreground mb-2">
            This screen encountered an unexpected error
          </h2>

          <p className="text-xs text-muted-foreground mb-4 leading-relaxed font-mono bg-card p-3 rounded-lg border border-border text-left overflow-x-auto">
            {error?.message || 'An unknown error occurred while rendering this section.'}
          </p>

          {requestId && (
            <p className="text-[11px] text-muted-foreground/80 mb-6 font-mono">
              Request ID: <span className="font-600 select-all">{requestId}</span>
            </p>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
            >
              <RotateCcw size={13} />
              Try Again
            </button>

            <Link
              to="/"
              onClick={this.handleReset}
              className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
            >
              <Home size={13} />
              Dashboard
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
