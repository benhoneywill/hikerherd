import type { FC } from "react";
import type { ErrorFallbackProps } from "blitz";

import {
  Link,
  Routes,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from "blitz";

import { Button } from "@chakra-ui/button";

import LoginForm from "app/features/auth/components/login-form";
import BoxLayout from "app/modules/common/layouts/box-layout";

const HomeButton = () => (
  <Link href={Routes.HomePage()} passHref>
    <Button as="a" size="lg" isFullWidth>
      Go home
    </Button>
  </Link>
);

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
      >
        <HomeButton />
      </BoxLayout>
    );
  }

  if (error instanceof NotFoundError) {
    return (
      <BoxLayout title="Not found" description="Are you lost?">
        <HomeButton />
      </BoxLayout>
    );
  }

  return (
    <BoxLayout
      title="There was an error"
      description={error.message || error.name}
    >
      <HomeButton />
    </BoxLayout>
  );
};

export default AppErrorFallback;
