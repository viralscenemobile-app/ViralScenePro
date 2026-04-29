import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center p-4 text-center text-white bg-black">
            <div className='bg-[#161616] p-8 rounded-2xl'>
                <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
                <button 
                    className="mt-4 px-6 py-2 bg-accent text-white rounded-full font-bold text-xs"
                    onClick={() => window.location.reload()}
                >
                    Reload App
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}
