import type { Post } from "db";
import type { BlitzPage, GetServerSideProps } from "blitz";

import {
  getSession,
  AuthorizationError,
  invokeWithMiddleware,
  NotFoundError,
  Routes,
  useRouter,
} from "blitz";

import { Layout } from "app/core/layouts/layout";
import { PostForm } from "app/posts/components/post-form";

import postBySlugQuery from "../../../queries/post-by-slug-query";

type EditPostPage = {
  post: Post;
};

const EditPostPage: BlitzPage<EditPostPage> = ({ post }) => {
  const router = useRouter();

  return (
    <PostForm
      post={post}
      onSuccess={(post) => {
        if (post.publishedAt) {
          router.push(Routes.PostPage({ slug: post.slug }));
        } else {
          router.push(Routes.MyPostsPage());
        }
      }}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  try {
    const post = await invokeWithMiddleware(
      postBySlugQuery,
      { slug: params?.slug as string },
      { req, res }
    );

    const session = await getSession(req, res);

    if (post.authorId !== session.userId) {
      throw new AuthorizationError();
    }

    return { props: { post } };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return {
        notFound: true,
      };
    } else {
      throw error;
    }
  }
};

EditPostPage.getLayout = (page) => <Layout title="Edit post">{page}</Layout>;

export default EditPostPage;
