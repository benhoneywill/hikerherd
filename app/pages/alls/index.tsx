import type { BlitzPage } from "blitz";

import { Suspense } from "react";
import { Head, Link, usePaginatedQuery, useRouter, Routes } from "blitz";

import Layout from "app/core/layouts/Layout";
import getAlls from "app/alls/queries/getAlls";

const ITEMS_PER_PAGE = 100;

export const AllsList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ alls, hasMore }] = usePaginatedQuery(getAlls, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {alls.map((all) => (
          <li key={all.id}>
            <Link href={Routes.ShowAllPage({ allId: all.id })}>
              <a>{all.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  );
};

const AllsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Alls</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewAllPage()}>
            <a>Create All</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <AllsList />
        </Suspense>
      </div>
    </>
  );
};

AllsPage.authenticate = true;
AllsPage.getLayout = (page) => <Layout>{page}</Layout>;

export default AllsPage;
