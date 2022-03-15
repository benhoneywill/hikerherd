import SuperJson from "superjson";

class ResetPasswordError extends Error {
  name = "ResetPasswordError";
  message = "Your reset password link is invalid or it has expired.";
}

SuperJson.registerClass(ResetPasswordError, "ResetPasswordError");

export default ResetPasswordError;
