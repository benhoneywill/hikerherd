import { resolver } from "blitz";

import db from "db";

const userCountQuery = resolver.pipe(async () => {
  return db.user.count();
});

export default userCountQuery;
