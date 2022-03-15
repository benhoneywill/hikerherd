import type { FC } from "react";

import { Link, Routes } from "blitz";

import { Avatar } from "@chakra-ui/react";
import { Tag, TagLabel } from "@chakra-ui/tag";

import getAvatarUrl from "app/apps/users/helpers/get-avatar-url";

type UserTagProps = {
  user: {
    username: string;
    avatar_id: string | null;
    avatar_version: number | null;
  };
};

const UserTag: FC<UserTagProps> = ({ user }) => {
  return (
    <Link href={Routes.ProfilePage({ username: user?.username })} passHref>
      <Tag as="a" size="lg" borderRadius="full">
        <Avatar size="xs" src={getAvatarUrl(user, 50)} ml={-1} mr={2} />
        <TagLabel>{user?.username}</TagLabel>
      </Tag>
    </Link>
  );
};

export default UserTag;
