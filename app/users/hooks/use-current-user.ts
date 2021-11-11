import { useQuery } from "blitz";

import currentUserQuery from "../queries/current-user-query";

export const useCurrentUser = () => {
  const [user] = useQuery(currentUserQuery, null);
  return user;
};
