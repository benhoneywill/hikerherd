import type { Comment } from "db";

import type { CommentRepliesResult } from "../queries/comment-replies-query";
import type { PostCommentsResult } from "../queries/post-comments-query";

import { createContext } from "react";

type CommentsContext = {
  parentPostId?: number;
  parentCommentId?: number;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  paginatedComments: Array<PostCommentsResult | CommentRepliesResult>;
  depth: number;
  addComment: (comment: Comment) => void;
  addedComments: Comment[];
};

const commentsContext = createContext<CommentsContext>({
  parentPostId: undefined,
  parentCommentId: undefined,
  isFetching: false,
  isFetchingNextPage: false,
  fetchNextPage: () => null,
  hasNextPage: false,
  paginatedComments: [],
  depth: 0,
  addComment: () => null,
  addedComments: [],
});

export default commentsContext;
