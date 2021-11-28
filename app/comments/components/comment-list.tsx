import React, { Fragment } from "react";

import { Stack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

import useComments from "../hooks/use-comments";

import Comment from "./comment";

const CommentList: React.FC = () => {
  const { paginatedComments, isFetchingNextPage, fetchNextPage, hasNextPage, addedComments } =
    useComments();

  return (
    <>
      <Stack>
        {addedComments.map((comment) => (
          <Comment key={comment.id} comment={comment} added />
        ))}

        {paginatedComments.map((page, i) => (
          <Fragment key={i}>
            {page.items.map((comment) => {
              const isAdded = addedComments.find((added) => added.id === comment.id);
              if (isAdded) return null;
              return <Comment key={comment.id} comment={comment} />;
            })}
          </Fragment>
        ))}
      </Stack>

      {hasNextPage && (
        <Button onClick={fetchNextPage} isDisabled={!!isFetchingNextPage}>
          {isFetchingNextPage ? "Loading..." : "Show replies"}
        </Button>
      )}
    </>
  );
};

export default CommentList;
