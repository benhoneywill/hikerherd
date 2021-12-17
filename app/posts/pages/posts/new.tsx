import type { BlitzPage } from "blitz";

import { useRouter, Routes } from "blitz";

import SingleColumnLayout from "app/common/layouts/single-column-layout";

import PostForm from "../../components/post-form";

const NewPostPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <PostForm
      onSuccess={(post) => {
        router.push(Routes.PostPage({ slug: post.slug }));
      }}
    />
  );
};

NewPostPage.authenticate = { redirectTo: Routes.LoginPage() };
NewPostPage.getLayout = (page) => (
  <SingleColumnLayout title="New post">{page}</SingleColumnLayout>
);

export default NewPostPage;
