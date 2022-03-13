import type { FC } from "react";
import type { ErrorFallbackProps } from "blitz";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import LoginForm from "app/apps/auth/components/login-form";
import BoxLayout from "app/layouts/box-layout";

const AppErrorFallback: FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  if (error instanceof AuthenticationError) {
    return (
      <BoxLayout
        title="Log in"
        description="You aren't logged in! You need to log in to continue."
      >
        <LoginForm onSuccess={resetErrorBoundary} />
      </BoxLayout>
    );
  }

  if (error instanceof AuthorizationError) {
    return (
      <BoxLayout
        title="Unauthorized"
        description="Sorry, you are not allowed to do that."
      />
    );
  }

  if (error instanceof NotFoundError) {
    return <BoxLayout title="Not found" description="Are you lost?" />;
  }

  return (
    <BoxLayout
      title="There was an error"
      description={error.message || error.name}
    />
  );
};

export default AppErrorFallback;
