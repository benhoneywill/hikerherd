import type { BlitzPage } from "blitz";

import { useRouter, Routes } from "blitz";

import SingleColumnLayout from "app/common/layouts/single-column-layout";
import BlogPostForm from "app/blogs/components/blog-post-form";

const NewBlogPostPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <BlogPostForm
      blogSlug={router.query.slug as string}
      onSuccess={() => {
        router.push(Routes.MyBlogPage({ slug: router.query.slug as string }));
      }}
    />
  );
};

NewBlogPostPage.authenticate = { redirectTo: Routes.LoginPage() };
NewBlogPostPage.getLayout = (page) => (
  <SingleColumnLayout title="New blog post">{page}</SingleColumnLayout>
);

export default NewBlogPostPage;
