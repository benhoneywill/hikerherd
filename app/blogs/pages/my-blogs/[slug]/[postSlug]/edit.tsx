import type { BlitzPage } from "blitz";

import { useQuery, Routes, useRouter } from "blitz";

import SingleColumnLayout from "app/common/layouts/single-column-layout";
import BlogPostForm from "app/blogs/components/blog-post-form";
import myBlogPostQuery from "app/blogs/queries/my-blog-post-query";

const EditBlogPostPage: BlitzPage = () => {
  const router = useRouter();

  const [blogPost] = useQuery(myBlogPostQuery, {
    slug: router.query.postSlug as string,
  });

  return (
    <BlogPostForm
      post={blogPost}
      blogSlug={router.query.slug as string}
      onSuccess={() => {
        router.push(Routes.MyBlogPage({ slug: router.query.slug as string }));
      }}
    />
  );
};

EditBlogPostPage.authenticate = { redirectTo: Routes.LoginPage() };
EditBlogPostPage.getLayout = (page) => (
  <SingleColumnLayout title="Edit post">{page}</SingleColumnLayout>
);

export default EditBlogPostPage;
