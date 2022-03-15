import {
  Document as BlitzDocument,
  Html,
  DocumentHead,
  Main,
  BlitzScript,
} from "blitz";

const Analytics = () => {
  const script =
    process.env.NODE_ENV === "production"
      ? "https://scripts.simpleanalyticscdn.com/latest.js"
      : "https://scripts.simpleanalyticscdn.com/latest.dev.js";

  return <script async defer src={script} />;
};

class Document extends BlitzDocument {
  render() {
    return (
      <Html lang="en">
        <DocumentHead />
        <body style={{ backgroundColor: "#edf2f7" }}>
          <Main />
          <BlitzScript />
          <Analytics />
        </body>
      </Html>
    );
  }
}

export default Document;
