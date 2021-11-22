import type { FC } from "react";
import type { ErrorFallbackProps } from "blitz";

import { ErrorComponent, AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import LoginForm from "app/auth/components/login-form";

const AppErrorFallback: FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  if (error instanceof AuthenticationError) {
    return <LoginForm onSuccess={resetErrorBoundary} />;
  }

  if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    );
  }

  if (error instanceof NotFoundError) {
    return <ErrorComponent statusCode={404} title="This page could not be found" />;
  }

  return (
    <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
  );
};

export default AppErrorFallback;
