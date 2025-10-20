import React, { Component, ErrorInfo, ReactNode } from 'react';
import Card from './Card';
import Button from './Button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
                    <Card className="max-w-md text-center">
                        <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
                        <p className="text-gray-300 mb-6">
                            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
                        </p>
                        {this.state.error && (
                            <details className="text-left mb-4 p-3 bg-gray-800 rounded text-sm text-gray-400">
                                <summary className="cursor-pointer">Error Details</summary>
                                <pre className="mt-2 whitespace-pre-wrap">{this.state.error.message}</pre>
                            </details>
                        )}
                        <div className="space-y-2">
                            <Button onClick={this.handleReset} className="w-full">
                                Try Again
                            </Button>
                            <Button 
                                onClick={() => window.location.reload()} 
                                variant="secondary" 
                                className="w-full"
                            >
                                Refresh Page
                            </Button>
                        </div>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;