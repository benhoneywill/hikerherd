import { useContext } from "react";

import commentsContext from "../contexts/comments-context";

const useComments = () => {
  return useContext(commentsContext);
};

export default useComments;
