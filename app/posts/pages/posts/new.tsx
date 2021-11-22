import type { BlitzPage } from "blitz";

import { useRouter, Routes } from "blitz";

import Layout from "app/core/layouts/layout";

import PostForm from "../../components/post-form";

const NewPostPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <div>
      <PostForm
        onSuccess={(post) => {
          if (post.publishedAt) {
            router.push(Routes.PostPage({ slug: post.slug }));
          } else {
            router.push(Routes.MyPostsPage());
          }
        }}
      />
    </div>
  );
};

NewPostPage.authenticate = { redirectTo: Routes.LoginPage() };
NewPostPage.getLayout = (page) => <Layout title="New post">{page}</Layout>;

export default NewPostPage;
