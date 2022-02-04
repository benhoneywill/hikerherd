import { z } from "zod";

const UpdateQuantityType = {
  INCREMENT: "increment",
  DECREMENT: "decrement",
};

const updateItemQuantitySchema = z.object({
  id: z.string(),
  type: z.nativeEnum(UpdateQuantityType),
});

export default updateItemQuantitySchema;
