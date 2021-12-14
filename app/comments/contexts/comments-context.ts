import type { CommentsResultItem } from "../queries/comments-query";
import type { CreateCommentResult } from "../mutations/create-comment-mutation";
import type { UpdateCommentResult } from "../mutations/update-comment-mutation";
import type { CommentRootType } from "db";

import { createContext } from "react";

type CommentsContext = {
  rootId: string;
  rootType: CommentRootType;
  parentId?: string;

  comments: CommentsResultItem[];

  pagination: {
    isFetching: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    hasNextPage?: boolean;
  };

  addedComments: CreateCommentResult[];
  addComment: (comment: CreateCommentResult) => void;
  updateComment: (comment: UpdateCommentResult) => void;

  canStartPagination: boolean;
  startPagination: () => void;
};

const commentsContext = createContext<CommentsContext>({} as CommentsContext);

export default commentsContext;
