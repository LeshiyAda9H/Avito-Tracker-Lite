import React, { Component, ReactNode } from 'react';
import { Typography, Container } from '@mui/material';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Произошла ошибка в компоненте:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container sx={{ padding: 2 }}>
          <Typography color="error" variant="h6">
            Произошла ошибка. Пожалуйста, перезагрузите страницу.
          </Typography>
        </Container>
      );
    }

    return this.props.children;
  }
}