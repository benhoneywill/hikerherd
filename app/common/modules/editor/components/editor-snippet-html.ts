import { Box } from "@chakra-ui/layout";
import styled from "@emotion/styled";

const EditorSnippetHtml = styled(Box)`
  * + * {
    margin-top: calc(var(--chakra-lineHeights-base) * 0.5em);
    &::first-child {
      margin-top: 0;
    }
  }

  a {
    color: var(--chakra-colors-blue-500);
    text-decoration: underline;
  }

  ul,
  ol {
    padding-left: 1.25em;

    li {
      margin-top: 0;
      margin-bottom: calc(var(--chakra-lineHeights-base) * 0.25em);

      p:last-child {
        margin: 0;
      }
    }
  }

  h2,
  h3 {
    font-weight: var(--chakra-fontWeights-bold);
  }

  img {
    display: none;
  }

  blockquote {
    color: var(--chakra-colors-gray-500);
    margin: calc(var(--chakra-lineHeights-base) * 0.5em) 0;
    padding-left: calc(var(--chakra-lineHeights-base) * 1em);
    border-left: 0.25em solid var(--chakra-colors-gray-300);
  }

  hr {
    display: none;
  }
`;

export default EditorSnippetHtml;
