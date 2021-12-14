import type { BlitzPage } from "blitz";

import { Routes } from "blitz";
import { useState } from "react";

import BoxLayout from "app/core/layouts/box-layout";

import ForgotPasswordForm from "../components/forgot-password-form";

const ForgotPasswordPage: BlitzPage = () => {
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div>
        <h2>Request Submitted</h2>
        <p>
          If your email is in our system, you will receive instructions to reset your password
          shortly.
        </p>
      </div>
    );
  }

  return <ForgotPasswordForm onSuccess={() => setSuccess(true)} />;
};

ForgotPasswordPage.redirectAuthenticatedTo = Routes.HomePage();
ForgotPasswordPage.getLayout = (page) => (
  <BoxLayout
    title="Forgot Your Password?"
    description="Enter your details below and we will email you instructions for resetting your password."
  >
    {page}
  </BoxLayout>
);

export default ForgotPasswordPage;
