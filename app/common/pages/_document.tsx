import { Document, Html, DocumentHead, Main, BlitzScript } from "blitz";

import styled from "@emotion/styled";

const StyledHtml = styled(Html)`
  min-height: 100%;
  body,
  body > #__next {
    min-height: 100%;
  }
`;

class MyDocument extends Document {
  render() {
    return (
      <StyledHtml lang="en">
        <DocumentHead />

        <body>
          <Main />
          <BlitzScript />
        </body>
      </StyledHtml>
    );
  }
}

export default MyDocument;
