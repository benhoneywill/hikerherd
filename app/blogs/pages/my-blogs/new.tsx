import type { BlitzPage } from "blitz";

import { useRouter, Routes } from "blitz";

import SingleColumnLayout from "app/common/layouts/single-column-layout";

import BlogForm from "../../components/blog-form";

const NewBlogPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <BlogForm
      onSuccess={(blog) => {
        router.push(Routes.BlogPage({ slug: blog.slug }));
      }}
    />
  );
};

NewBlogPage.authenticate = { redirectTo: Routes.LoginPage() };
NewBlogPage.getLayout = (page) => (
  <SingleColumnLayout title="New blog">{page}</SingleColumnLayout>
);

export default NewBlogPage;
