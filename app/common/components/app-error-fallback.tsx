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

import BoxLayout from "../layouts/box-layout";

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
        description="You need to be logged in to do that!"
      >
        <LoginForm onSuccess={resetErrorBoundary} />
      </BoxLayout>
    );
  }

  if (error instanceof AuthorizationError) {
    return (
      <BoxLayout
        title="Unauthorized"
        description="Sorry, you are not authorized to access this."
      >
        <HomeButton />
      </BoxLayout>
    );
  }

  if (error instanceof NotFoundError) {
    return (
      <BoxLayout
        title="Not found"
        description="Even the best navigators get lost sometimes."
      >
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
