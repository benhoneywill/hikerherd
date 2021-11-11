import type { FC } from "react";

import { Link, Routes } from "blitz";

type PostListProps = {
  posts: Array<{ title: string; slug: string }>;
};

export const PostList: FC<PostListProps> = ({ posts }) => {
  return (
    <ul>
      {posts.map(({ title, slug }) => (
        <Link key={slug} href={Routes.PostPage({ slug })} passHref>
          <a>{title}</a>
        </Link>
      ))}
    </ul>
  );
};
