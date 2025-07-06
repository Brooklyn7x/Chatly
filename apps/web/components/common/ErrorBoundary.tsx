"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Chat component error:", error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Optional: Send to error tracking
    // Sentry.captureException(error, { extra: errorInfo });
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center mt-10 h-64 p-6 border rounded-lg bg-muted/20 w-full max-w-md mx-auto">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Chat temporarily unavailable
          </h3>
          <p className="text-muted-foreground text-center mb-4">
            {this.state.error?.message ||
              "Something went wrong with the chat. You can refresh or try again."}
          </p>
          <Button onClick={this.handleRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
