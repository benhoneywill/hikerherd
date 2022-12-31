import type { BlitzPage } from "blitz";

import { Fragment } from "react";

import { Heading, Text } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";

import SidebarLayout from "app/layouts/sidebar-layout";
import Card from "app/components/card";

const ContactPage: BlitzPage = () => {
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Fragment>
      <Heading size="md" mb={6}>
        Contact Me
      </Heading>
      <Text mb={5} color={textColor}>
        Get in touch to leave me feedback about hikerherd or to ask any
        questions.
      </Text>
      <Card>
        <Heading size="sm">Reach out via email</Heading>
        <Text color={textColor} textDecoration="underline">
          <a href="mailto:ben@hikerherd.com">ben@hikerherd.com</a>
        </Text>
      </Card>
    </Fragment>
  );
};

ContactPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ContactPage;
