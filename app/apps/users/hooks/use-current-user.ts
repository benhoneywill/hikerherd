import { useQuery } from "blitz";

import currentUserQuery from "../queries/current-user-query";

type UseCurrentUserOptions = {
  suspense?: boolean;
};

const useCurrentUser = (options: UseCurrentUserOptions = {}) => {
  const { suspense = true } = options;

  const [user] = useQuery(currentUserQuery, {}, { suspense });

  return user;
};

export default useCurrentUser;
