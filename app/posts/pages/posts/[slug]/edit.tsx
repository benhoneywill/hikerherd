import type { BlitzPage } from "blitz";

import { useQuery, Routes, useRouter } from "blitz";

import SingleColumnLayout from "app/common/layouts/single-column-layout";
import PostForm from "app/posts/components/post-form";

import myPostQuery from "../../../queries/my-post-query";

const EditPostPage: BlitzPage = () => {
  const router = useRouter();

  const [post] = useQuery(myPostQuery, { slug: router.query.slug as string });

  return (
    <PostForm
      post={post}
      onSuccess={(post) => {
        router.push(Routes.PostPage({ slug: post.slug }));
      }}
    />
  );
};

EditPostPage.authenticate = { redirectTo: Routes.LoginPage() };
EditPostPage.getLayout = (page) => (
  <SingleColumnLayout title="Edit post">{page}</SingleColumnLayout>
);

export default EditPostPage;
