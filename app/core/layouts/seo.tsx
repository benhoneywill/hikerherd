import React from "react";
import { Head } from "blitz";

type SeoProps = {
  title?: string | null;
  description?: string | null;
};

const DEFAULT_TITLE = "hikerherd | the trail online";

const DEFAULT_DESCRIPTION = `
  The best online hiking and backpacking community, hikerherd is a place to get advice,
  share stories, review gear and more. Join hikerherd now and start using our free online
  tools designed to make your backpacking experience the best it can be!
`;

const Seo: React.FC<SeoProps> = ({ title, description }) => (
  <Head>
    <title>{title ? `${title} | hikerherd` : DEFAULT_TITLE}</title>
    <meta name="description" content={description || DEFAULT_DESCRIPTION} />
  </Head>
);

export default Seo;
