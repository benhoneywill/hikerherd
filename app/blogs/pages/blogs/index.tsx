import type { BlitzPage } from "blitz";

import ThreeColumnLayout from "app/common/layouts/three-column-layout";

const BlogsPage: BlitzPage = () => {
  return <p>Blogs and blog posts go here</p>;
};

BlogsPage.getLayout = (page) => <ThreeColumnLayout>{page}</ThreeColumnLayout>;

export default BlogsPage;
