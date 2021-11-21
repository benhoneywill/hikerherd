import type { FC } from "react";

import { Link, Routes } from "blitz";

type PostListProps = {
  posts: Array<{ title: string; slug: string }>;
  myPosts?: boolean;
};

export const PostList: FC<PostListProps> = ({ posts, myPosts }) => {
  const postPath = (slug: string) =>
    myPosts ? Routes.EditPostPage({ slug }) : Routes.PostPage({ slug });

  return (
    <ul>
      {posts.map(({ title, slug }) => (
        <li key={slug}>
          <Link href={postPath(slug)} passHref>
            <a>{title}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};
