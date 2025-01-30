import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { RefreshCcw } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-6 glass-card animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reload page
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;