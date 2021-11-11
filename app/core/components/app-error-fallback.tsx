import type { FC } from "react";
import type { ErrorFallbackProps } from "blitz";

import { ErrorComponent, AuthenticationError, AuthorizationError } from "blitz";

import { LoginForm } from "app/auth/components/login-form";

export const AppErrorFallback: FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  const isAuthenticationError = error instanceof AuthenticationError;
  const isAuthorizationError = error instanceof AuthorizationError;

  if (isAuthenticationError) {
    return <LoginForm onSuccess={resetErrorBoundary} />;
  }

  if (isAuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    );
  }

  return (
    <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
  );
};
