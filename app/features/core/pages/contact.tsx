import type { BlitzPage } from "blitz";

import { Fragment } from "react";

import { Heading, Text, Link } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";

import SidebarLayout from "app/modules/common/layouts/sidebar-layout";

const ContactPage: BlitzPage = () => {
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Fragment>
      <Heading size="md" mb={4}>
        Contact
      </Heading>
      <Text color={textColor} mb={2}>
        <strong>Hi!</strong> I am Ben, the creator of hikerherd.
      </Text>
      <Text color={textColor} mb={2}>
        I work on hikerherd by myself in my free time. If you need to get in
        touch I will do my best to respond as quickly as I can.
      </Text>

      <Heading size="sm" mb={4} mt={6}>
        Beta feedback
      </Heading>
      <Text color={textColor} mb={2}>
        If you want to leave feedback about the hikerherd beta, I would love to
        hear from you!{" "}
        <Link
          textDecoration="underline"
          isExternal
          href="https://docs.google.com/forms/d/e/1FAIpQLSd488niomGdU4Cd96hLGTakK5isfE5Ajzy4HTMOjchQ6ZdFcQ/viewform"
        >
          You can leave me feedback here
        </Link>
        . Thank you for your comments.
      </Text>

      <Heading size="sm" mb={4} mt={6}>
        Send me an email
      </Heading>
      <Text color={textColor} mb={2}>
        You can reach me by email at{" "}
        <Link textDecoration="underline" href="mailto:ben@hikerherd.com">
          ben@hikerherd.com
        </Link>
      </Text>

      <Heading size="sm" mb={4} mt={6}>
        Social
      </Heading>
      <Text color={textColor} mb={2}>
        You can find me online as <strong>@benontrail</strong> on{" "}
        <Link
          textDecoration="underline"
          isExternal
          href="https://www.reddit.com/u/benontrail/"
        >
          Reddit
        </Link>{" "}
        and{" "}
        <Link
          textDecoration="underline"
          isExternal
          href="https://www.instagram.com/benontrail/"
        >
          Instagram
        </Link>
        .
      </Text>
    </Fragment>
  );
};

ContactPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ContactPage;
