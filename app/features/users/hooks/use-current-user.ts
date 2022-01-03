import { useQuery } from "blitz";

import currentUserQuery from "../queries/current-user-query";

const useCurrentUser = () => {
  const [user] = useQuery(currentUserQuery, null);
  return user;
};

export default useCurrentUser;
