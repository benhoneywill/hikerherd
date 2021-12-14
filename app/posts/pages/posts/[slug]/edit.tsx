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

import SingleColumnLayout from "app/core/layouts/single-column-layout";
import PostForm from "app/posts/components/post-form";

import postBySlugQuery from "../../../queries/public-post-query";

type EditPostPage = {
  post: Post;
};

const EditPostPage: BlitzPage<EditPostPage> = ({ post }) => {
  const router = useRouter();

  return (
    <PostForm
      post={post}
      onSuccess={(post) => {
        router.push(Routes.PostPage({ slug: post.slug }));
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

EditPostPage.authenticate = { redirectTo: Routes.LoginPage() };
EditPostPage.getLayout = (page) => (
  <SingleColumnLayout title="Edit post">{page}</SingleColumnLayout>
);

export default EditPostPage;
