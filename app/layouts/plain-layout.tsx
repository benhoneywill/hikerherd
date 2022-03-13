import type { BlitzLayout } from "blitz";

import { Fragment } from "react";

import Header from "app/components/header/components/header";
import Seo from "app/components/seo";

type PlainLayoutProps = {
  title?: string;
  description?: string;
};

const PlainLayout: BlitzLayout<PlainLayoutProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <Fragment>
      <Seo title={title} description={description} />

      <Header />

      {children}
    </Fragment>
  );
};

export default PlainLayout;
