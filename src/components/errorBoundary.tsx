import React, { ReactNode } from "react";

export interface ErrorBoundaryProps {
  errorNode: (error: Error) => ReactNode
}

interface ErrorBoundaryState {
  errorThrown: Error | null
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<ErrorBoundaryProps>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<ErrorBoundaryProps>) {
    super(props)
    this.state = {
      errorThrown: null
    }
  }

  componentDidCatch(error: Error) {
    this.setState({
      errorThrown: error
    })
  }

  render() {
    return this.state.errorThrown ?
      this.props.errorNode(this.state.errorThrown) :
      this.props.children
  }
}