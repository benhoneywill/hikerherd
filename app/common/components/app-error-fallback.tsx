import type { FC } from "react";
import type { ErrorFallbackProps } from "blitz";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import LoginForm from "app/auth/components/login-form";

import BoxLayout from "../layouts/box-layout";

const AppErrorFallback: FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  if (error instanceof AuthenticationError) {
    return (
      <BoxLayout title="Log in" description="You need to log in to do this.">
        <LoginForm onSuccess={resetErrorBoundary} />;
      </BoxLayout>
    );
  }

  if (error instanceof AuthorizationError) {
    return (
      <BoxLayout
        title="Unauthorized"
        description="Sorry, you are not authorized to access this."
      />
    );
  }

  if (error instanceof NotFoundError) {
    return (
      <BoxLayout
        title="Not found"
        description="Sorry, This page could not be found."
      />
    );
  }

  return (
    <BoxLayout
      title="There was an error."
      description={error.message || error.name}
    />
  );
};

export default AppErrorFallback;
