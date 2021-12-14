import { Box } from "@chakra-ui/layout";
import styled from "@emotion/styled";

const EditorHtml = styled(Box)`
  .ProseMirror:focus {
    outline: none;
  }

  p {
    margin: calc(var(--chakra-lineHeights-base) * 0.5em) 0;
  }

  a {
    color: var(--chakra-colors-blue-500);
    text-decoration: underline;
  }

  ul,
  ol {
    margin: calc(var(--chakra-lineHeights-base) * 0.5em) 0
      calc(var(--chakra-lineHeights-base) * 0.75em) 0;
    padding-left: 1em;
  }

  li {
    margin-bottom: calc(var(--chakra-lineHeights-base) * 0.25em) 0;
  }

  li p:last-child {
    margin: 0;
  }

  h2,
  h3 {
    line-height: var(--chakra-lineHeights-short);
    font-weight: var(--chakra-fontWeights-bold);
  }

  h2 {
    font-size: calc((var(--chakra-lineHeights-base) * 2) / var(--chakra-lineHeights-short) * 1em);
    margin-top: calc(var(--chakra-lineHeights-base) * 0.5em);
  }

  h3 {
    font-size: calc(
      (var(--chakra-lineHeights-base) * 1.25) / var(--chakra-lineHeights-short) * 1em
    );
    margin-top: calc(var(--chakra-lineHeights-base) * 0.75em);
  }

  img {
    width: 100%;
    max-width: 700px;
    max-height: calc(var(--chakra-lineHeights-base) * 25em);
    height: auto;
    margin: calc(var(--chakra-lineHeights-base) * 2em) auto;
    &.has-focus {
      outline: 2px solid var(--chakra-colors-blue-500);
    }
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
    &.has-focus {
      outline: 2px solid var(--chakra-colors-blue-500);
    }
  }

  /* Editor placeholder styles */
  p.is-editor-empty:first-of-type::before {
    color: var(--chakra-colors-gray-400);
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  /* Editor bubble menu styles */
  .tippy-svg-arrow {
    fill: black;
    z-index: -1;
  }
`;

export default EditorHtml;
