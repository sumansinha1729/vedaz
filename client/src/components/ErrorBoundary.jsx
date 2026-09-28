import { Component } from 'react';
import Button from './ui/Button';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="max-w-sm text-sm text-muted">
          An unexpected error occurred. Reloading the page usually fixes it.
        </p>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </main>
    );
  }
}
