import { Box } from "@chakra-ui/layout";
import styled from "@emotion/styled";

const verticalMargin = (val: number) =>
  `calc(var(--chakra-lineHeights-base) * ${val}em)`;
const headerFontSize = (val: number) =>
  `calc((var(--chakra-lineHeights-base) * ${val}) / var(--chakra-lineHeights-short) * 1em)`;

const EditorHtml = styled(Box)`
  p,
  ul,
  ol {
    margin: ${verticalMargin(0.5)} 0;
    &:first-child {
      margin-top: 0;
    }
  }

  a {
    color: var(--chakra-colors-blue-500);
    text-decoration: underline;
  }

  ol,
  ul {
    padding-left: 1em;
  }

  li {
    margin-bottom: ${verticalMargin(0.25)};
    p:last-child {
      margin: 0;
    }
  }

  h2,
  h3 {
    line-height: var(--chakra-lineHeights-short);
    font-weight: var(--chakra-fontWeights-bold);
  }

  h2 {
    font-size: ${headerFontSize(2)};
    &:not(:first-child) {
      margin-top: ${verticalMargin(0.5)};
    }
  }

  h3 {
    font-size: ${headerFontSize(1.25)};
    &:not(:first-child) {
      margin-top: ${verticalMargin(0.75)};
    }
  }

  img {
    width: 100%;
    max-width: 700px;
    max-height: calc(var(--chakra-lineHeights-base) * 25em);
    height: auto;
    margin: calc(var(--chakra-lineHeights-base) * 2em) auto;
  }

  blockquote {
    color: var(--chakra-colors-gray-500);
    margin: calc(var(--chakra-lineHeights-base) * 1.5em) 0;
    padding-left: calc(var(--chakra-lineHeights-base) * 1em);
    margin-left: calc(var(--chakra-lineHeights-base) * 0.5em);
    font-size: 1.2em;
    line-height: var(--chakra-lineHeights-short);
    border-left: 0.25em solid var(--chakra-colors-gray-300);
  }

  hr {
    display: block;
    width: 20%;
    height: 2px;
    border-radius: 2px;
    background: var(--chakra-colors-gray-100);
    border: none;
    margin: calc(var(--chakra-lineHeights-base) * 2em) auto;
  }
`;

export default EditorHtml;
