import { z } from "zod";

const addImageSchema = z.object({
  image: z.string().min(1, "An image url is required"),
});

export default addImageSchema;
