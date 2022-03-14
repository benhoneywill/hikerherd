import type { FC } from "react";

import { useState } from "react";
import { invalidateQuery, useMutation } from "blitz";

import { useDropzone } from "react-dropzone";
import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";

import uploadImageToCloudinary from "app/apps/core/helpers/upload-image-to-cloudinary";

import useCurrentUser from "../hooks/use-current-user";
import changeAvatarMutation from "../mutations/change-avatar-mutation";
import userQuery from "../queries/user-query";
import currentUserQuery from "../queries/current-user-query";

const AvatarUploader: FC = () => {
  const currentUser = useCurrentUser();
  const [changeAvatar] = useMutation(changeAvatarMutation);
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: async (files) => {
      setLoading(true);

      if (currentUser) {
        const file = files[0];

        if (file) {
          try {
            const data = await uploadImageToCloudinary(file, {
              folder: "avatars",
              filename: currentUser.username,
            });

            await changeAvatar({ avatar: data.url });

            invalidateQuery(userQuery, { username: currentUser.username });
            invalidateQuery(currentUserQuery);

            toast({
              title: "Your avatar was changed successfully",
              status: "success",
            });
          } catch (error) {
            toast({
              title: "Oops, there was a problem changing your avatar",
              status: "error",
            });
          }
        }
      }

      setLoading(false);
    },
  });

  return (
    <Box {...getRootProps()} pt={2}>
      <input {...getInputProps()} />
      <Button isLoading={loading} size="sm">
        Change avatar
      </Button>
    </Box>
  );
};

export default AvatarUploader;
