import type { BlitzPage } from "blitz";

import { useRouter, Routes } from "blitz";

import { Container } from "@chakra-ui/layout";

import Layout from "app/core/layouts/layout";

import PostForm from "../../components/post-form";

const NewPostPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <Container maxW="container.lg">
      <PostForm
        onSuccess={(post) => {
          if (post.publishedAt) {
            router.push(Routes.PostPage({ slug: post.slug }));
          } else {
            router.push(Routes.MyPostsPage());
          }
        }}
      />
    </Container>
  );
};

NewPostPage.authenticate = { redirectTo: Routes.LoginPage() };
NewPostPage.getLayout = (page) => <Layout title="New post">{page}</Layout>;

export default NewPostPage;
