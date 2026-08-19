import { Component } from "react";
import { logError } from "../monitoring";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logError(error, { componentStack: info.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        <p className="status error">
          Une erreur inattendue est survenue. Veuillez rafraîchir la page.
        </p>
      );
    }
    return this.props.children;
  }
}
