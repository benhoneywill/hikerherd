import type { FC } from "react";

import { Link, Routes } from "blitz";

type PostListProps = {
  posts: Array<{ title: string; slug: string }>;
};

const PostList: FC<PostListProps> = ({ posts }) => {
  return (
    <ul>
      {posts.map(({ title, slug }) => (
        <li key={slug}>
          <Link href={Routes.PostPage({ slug })} passHref>
            <a>{title}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
