type ThreadedCommentInclude = {
  author: { select: { username: true; avatar: true } };
  replies?: {
    include: ThreadedCommentInclude;
    take: number;
    skip: number;
  };
  _count: {
    select: {
      replies: true;
    };
  };
};

type ThreadedCommentsIncludeOptions = {
  depth: number;
  take?: number;
};

const threadedCommentInclude = ({
  depth,
  take = 10,
}: ThreadedCommentsIncludeOptions): ThreadedCommentInclude => {
  const base: ThreadedCommentInclude = {
    author: { select: { username: true, avatar: true } },
    _count: {
      select: { replies: true },
    },
  };

  if (depth <= 0) {
    return base;
  }

  return {
    ...base,
    replies: {
      take,
      skip: 0,
      include: threadedCommentInclude({ depth: depth - 1 }),
    },
  };
};

export default threadedCommentInclude;
