import type { FC } from "react";

import { Stack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

import useComments from "../hooks/use-comments";

import Comment from "./comment";

const CommentList: FC = () => {
  const {
    comments,
    pagination,
    addedComments,
    canStartPagination,
    startPagination,
  } = useComments();

  const { hasNextPage, isFetching, fetchNextPage, isFetchingNextPage } =
    pagination;

  return (
    <>
      <Stack>
        {addedComments.map((comment) => (
          <Comment key={comment.id} comment={comment} added />
        ))}

        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </Stack>

      {(canStartPagination || isFetching) && (
        <Button onClick={startPagination} isLoading={isFetching}>
          Load more
        </Button>
      )}

      {(hasNextPage || isFetchingNextPage) && (
        <Button onClick={fetchNextPage} isLoading={isFetchingNextPage}>
          Load more
        </Button>
      )}
    </>
  );
};

export default CommentList;
