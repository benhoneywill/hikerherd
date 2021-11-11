import type { BlitzPage } from "blitz";

import { useRouter, Routes } from "blitz";

import { Layout } from "app/core/layouts/layout";

import { CreatePostForm } from "../../components/create-post-form";

const NewPostPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <div>
      <CreatePostForm
        onSuccess={(post) => {
          const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/";
          router.push(next);
        }}
      />
    </div>
  );
};

NewPostPage.authenticate = { redirectTo: Routes.LoginPage() };
NewPostPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>;

export default NewPostPage;
