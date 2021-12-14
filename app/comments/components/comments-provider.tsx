import type { CommentsResultItem } from "../queries/comments-query";
import type { CreateCommentResult } from "../mutations/create-comment-mutation";
import type { UpdateCommentResult } from "../mutations/update-comment-mutation";
import type { FC } from "react";
import type { CommentRootType } from "db";

import { useMemo, useState } from "react";

import { useInfiniteQuery } from "next/data-client";

import commentsContext from "../contexts/comments-context";
import commentsQuery from "../queries/comments-query";

const { Provider } = commentsContext;

type CommentsProviderProps = {
  rootId: string;
  rootType: CommentRootType;
  parentId?: string;
  initialComments?: CommentsResultItem[];
  commentCount?: number;
};

const CommentsProvider: FC<CommentsProviderProps> = ({
  children,
  rootId,
  rootType,
  parentId,
  initialComments = [],
  commentCount = 0,
}) => {
  const isCommentReplies = !!parentId;
  const isRootComments = !isCommentReplies;

  const [addedComments, setAddedComments] = useState<CreateCommentResult[]>([]);
  const [updatedComments, setUpdatedComments] = useState<{ [id in string]: UpdateCommentResult }>(
    {}
  );
  const [paginationStarted, setPaginationStarted] = useState(isRootComments);

  const canPaginate = isCommentReplies && initialComments.length < commentCount;

  const [commentPages, pagination] = useInfiniteQuery(
    commentsQuery,
    (page = { skip: initialComments.length }) => ({
      ...page,
      rootId,
      rootType,
      parentId,
      depth: isCommentReplies ? 2 : 4,
    }),
    {
      suspense: isRootComments,
      enabled: paginationStarted,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  const comments = useMemo(() => {
    let commentArray: CommentsResultItem[] = initialComments;

    commentPages?.forEach(({ items }) => {
      commentArray = commentArray.concat(items);
    });

    commentArray = commentArray.filter(
      (comment) => !addedComments.find((added) => added.id === comment.id)
    );

    if (Object.keys(updatedComments).length) {
      commentArray = commentArray.map((comment) => {
        const updated = updatedComments[comment.id];
        return updated || comment;
      });
    }

    return commentArray;
  }, [initialComments, commentPages, addedComments, updatedComments]);

  return (
    <Provider
      value={{
        rootId,
        rootType,
        parentId,

        addedComments,
        addComment: (comment: CreateCommentResult) => {
          setAddedComments((items) => [comment, ...items]);
        },
        updateComment: (comment: UpdateCommentResult) => {
          setUpdatedComments((items) => ({ ...items, [comment.id]: comment }));
        },

        canStartPagination: canPaginate && !paginationStarted,
        startPagination: () => setPaginationStarted(canPaginate),

        comments,
        pagination,
      }}
    >
      {children}
    </Provider>
  );
};

export default CommentsProvider;
