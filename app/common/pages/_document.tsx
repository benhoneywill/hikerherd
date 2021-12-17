import { Document, Html, DocumentHead, Main, BlitzScript } from "blitz";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <DocumentHead />

        <body>
          <Main />
          <BlitzScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
