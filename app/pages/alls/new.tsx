import type { BlitzPage } from "blitz";

import { Link, useRouter, useMutation, Routes } from "blitz";

import Layout from "app/core/layouts/Layout";
import createAll from "app/alls/mutations/createAll";
import { AllForm, FORM_ERROR } from "app/alls/components/AllForm";

const NewAllPage: BlitzPage = () => {
  const router = useRouter();
  const [createAllMutation] = useMutation(createAll);

  return (
    <div>
      <h1>Create New All</h1>

      <AllForm
        submitText="Create All"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateAll}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const all = await createAllMutation(values);
            router.push(Routes.ShowAllPage({ allId: all.id }));
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.AllsPage()}>
          <a>Alls</a>
        </Link>
      </p>
    </div>
  );
};

NewAllPage.authenticate = true;
NewAllPage.getLayout = (page) => (
  <Layout title={"Create New All"}>{page}</Layout>
);

export default NewAllPage;
