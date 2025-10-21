import React, { Component, ErrorInfo, ReactNode } from 'react';
import Card from './Card';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    isRetrying: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        isRetrying: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, isRetrying: false };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        
        // Report to error tracking service in production
        if (process.env.NODE_ENV === 'production') {
            // Example: Sentry.captureException(error, { contexts: { errorInfo } });
        }
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: undefined, isRetrying: false });
    };
    
    private handleRetry = () => {
        this.setState({ isRetrying: true });
        setTimeout(() => {
            this.handleReset();
        }, 1000);
    };

    public render() {
        if (this.state.hasError) {
            return (
                <main className="min-h-screen flex items-center justify-center bg-gray-900 p-4" role="main">
                    <Card variant="elevated" className="max-w-md text-center">
                        <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
                        <p className="text-gray-300 mb-6">
                            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
                        </p>
                        {this.state.error && (
                            <details className="text-left mb-4 p-3 bg-gray-800 rounded text-sm text-gray-400">
                                <summary className="cursor-pointer">Error Details</summary>
                                <pre className="mt-2 whitespace-pre-wrap">{this.state.error.message}</pre>
                                {this.state.error.stack && (
                                    <pre className="mt-2 text-xs text-gray-500 whitespace-pre-wrap">
                                        {this.state.error.stack.slice(0, 500)}...
                                    </pre>
                                )}
                            </details>
                        )}
                        <div className="space-y-2">
                            <Button 
                                onClick={this.handleRetry} 
                                className="w-full"
                                loading={this.state.isRetrying}
                                disabled={this.state.isRetrying}
                            >
                                {this.state.isRetrying ? 'Retrying...' : 'Try Again'}
                            </Button>
                            <Button 
                                onClick={() => window.location.reload()} 
                                variant="secondary" 
                                className="w-full"
                            >
                                Refresh Page
                            </Button>
                            <Button 
                                onClick={() => window.location.href = '/'} 
                                variant="secondary" 
                                className="w-full"
                            >
                                Go Home
                            </Button>
                        </div>
                    </Card>
                </main>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;