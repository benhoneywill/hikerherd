import type { BlitzPage } from "blitz";

import { Suspense } from "react";
import {
  Head,
  Link,
  useRouter,
  useQuery,
  useMutation,
  useParam,
  Routes,
} from "blitz";

import Layout from "app/core/layouts/Layout";
import getAll from "app/alls/queries/getAll";
import updateAll from "app/alls/mutations/updateAll";
import { AllForm, FORM_ERROR } from "app/alls/components/AllForm";

export const EditAll = () => {
  const router = useRouter();
  const allId = useParam("allId", "number");
  const [all, { setQueryData }] = useQuery(
    getAll,
    { id: allId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateAllMutation] = useMutation(updateAll);

  return (
    <>
      <Head>
        <title>Edit All {all.id}</title>
      </Head>

      <div>
        <h1>Edit All {all.id}</h1>
        <pre>{JSON.stringify(all, null, 2)}</pre>

        <AllForm
          submitText="Update All"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateAll}
          initialValues={all}
          onSubmit={async (values) => {
            try {
              const updated = await updateAllMutation({
                id: all.id,
                ...values,
              });
              await setQueryData(updated);
              router.push(Routes.ShowAllPage({ allId: updated.id }));
            } catch (error: any) {
              console.error(error);
              return {
                [FORM_ERROR]: error.toString(),
              };
            }
          }}
        />
      </div>
    </>
  );
};

const EditAllPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditAll />
      </Suspense>

      <p>
        <Link href={Routes.AllsPage()}>
          <a>Alls</a>
        </Link>
      </p>
    </div>
  );
};

EditAllPage.authenticate = true;
EditAllPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditAllPage;
