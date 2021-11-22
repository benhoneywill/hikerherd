import type { BlitzPage } from "blitz";

import { useRouter, Link, Routes } from "blitz";

import Layout from "app/core/layouts/layout";
import LoginForm from "app/auth/components/login-form";

const LoginPage: BlitzPage = () => {
  const router = useRouter();
  const redirectTo = decodeURIComponent((router.query.next as string) || "/");

  return (
    <div>
      <LoginForm onSuccess={() => router.push(redirectTo)} />

      <div>
        <Link href={Routes.ForgotPasswordPage()}>
          <a>Forgot your password?</a>
        </Link>
        Or
        <Link href={Routes.SignupPage()}>Sign Up</Link>
      </div>
    </div>
  );
};

LoginPage.redirectAuthenticatedTo = Routes.HomePage();
LoginPage.getLayout = (page) => <Layout title="Login">{page}</Layout>;

export default LoginPage;
