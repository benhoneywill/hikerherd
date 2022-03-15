import type { User } from "@prisma/client";

import cloudinaryClient from "integrations/cloudinary-client";

const getAvatarUrl = (
  user: Pick<User, "avatar_id" | "avatar_version"> | null | undefined,
  size: number
) => {
  if (!user?.avatar_id) return "";

  const version = user.avatar_version ? `${user.avatar_version}` : undefined;

  return cloudinaryClient.url(user.avatar_id, {
    width: size,
    height: size,
    crop: "fill",
    gravity: "face",
    version,
  });
};

export default getAvatarUrl;
