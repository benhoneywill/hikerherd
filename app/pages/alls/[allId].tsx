import type { BlitzPage } from "blitz";

import { Suspense } from "react";
import {
  Head,
  Link,
  useRouter,
  useQuery,
  useParam,
  useMutation,
  Routes,
} from "blitz";

import Layout from "app/core/layouts/Layout";
import getAll from "app/alls/queries/getAll";
import deleteAll from "app/alls/mutations/deleteAll";

export const All = () => {
  const router = useRouter();
  const allId = useParam("allId", "number");
  const [deleteAllMutation] = useMutation(deleteAll);
  const [all] = useQuery(getAll, { id: allId });

  return (
    <>
      <Head>
        <title>All {all.id}</title>
      </Head>

      <div>
        <h1>All {all.id}</h1>
        <pre>{JSON.stringify(all, null, 2)}</pre>

        <Link href={Routes.EditAllPage({ allId: all.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteAllMutation({ id: all.id });
              router.push(Routes.AllsPage());
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

const ShowAllPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.AllsPage()}>
          <a>Alls</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <All />
      </Suspense>
    </div>
  );
};

ShowAllPage.authenticate = true;
ShowAllPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowAllPage;
