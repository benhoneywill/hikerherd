import type { Comment } from "db";

import React, { useState } from "react";

import { useInfiniteQuery } from "next/data-client";

import commentsContext from "../contexts/comments-context";
import commentRepliesQuery from "../queries/comment-replies-query";
import postCommentsQuery from "../queries/post-comments-query";

const { Provider } = commentsContext;

type CommentsProviderProps = {
  parentPostId?: number;
  parentCommentId?: number;
  depth: number;
};

const CommentsProvider: React.FC<CommentsProviderProps> = ({
  children,
  parentPostId,
  parentCommentId,
  depth,
}) => {
  const [addedComments, setAddedComments] = useState<Comment[]>([]);

  const isCommentReplies = !!parentCommentId;
  const isPostComments = !isCommentReplies && !!parentPostId;

  const [postComments, post] = useInfiniteQuery(
    postCommentsQuery,
    (page = { take: 20, skip: 0 }) => ({ ...page, id: parentPostId }),
    {
      enabled: isPostComments,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  const initialRepliesPagination = depth < 1 ? { take: 5, skip: 0 } : { take: 0, skip: 0 };

  const [commentReplies, comment] = useInfiniteQuery(
    commentRepliesQuery,
    (page = initialRepliesPagination) => ({ ...page, id: parentCommentId as number }),
    {
      enabled: isCommentReplies,
      getNextPageParam: (lastPage) => {
        if (lastPage.nextPage?.take === 0) {
          return { ...lastPage.nextPage, take: 5 };
        } else {
          return lastPage.nextPage;
        }
      },
    }
  );

  const addComment = (comment: Comment) => {
    setAddedComments((items) => [comment, ...items]);
  };

  return (
    <Provider
      value={{
        parentPostId,
        parentCommentId,
        depth,

        addComment,
        addedComments,

        paginatedComments: (isCommentReplies ? commentReplies : postComments) || [],

        isFetching: isCommentReplies ? comment.isFetching : post.isFetching,

        isFetchingNextPage: isCommentReplies ? comment.isFetchingNextPage : post.isFetchingNextPage,

        fetchNextPage: isCommentReplies ? comment.fetchNextPage : post.fetchNextPage,

        hasNextPage: isCommentReplies ? comment.hasNextPage : post.hasNextPage,
      }}
    >
      {children}
    </Provider>
  );
};

export default CommentsProvider;
