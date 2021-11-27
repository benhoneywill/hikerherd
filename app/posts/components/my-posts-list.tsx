import type { FC } from "react";

import { Link, Routes } from "blitz";

type MyPostsListProps = {
  posts: Array<{ title: string; id: number }>;
};

const MyPostsList: FC<MyPostsListProps> = ({ posts }) => {
  return (
    <ul>
      {posts.map(({ title, id }) => (
        <li key={id}>
          <Link href={Routes.MyPostPage({ id })} passHref>
            <a>{title}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MyPostsList;
