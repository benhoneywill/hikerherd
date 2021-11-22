import SuperJson from "superjson";

class ResetPasswordError extends Error {
  name = "ResetPasswordError";
  message = "Reset password link is invalid or it has expired.";
}

SuperJson.registerClass(ResetPasswordError);

export default ResetPasswordError;
