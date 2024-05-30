import { z } from "zod";

export default z.object({
  name: z.string().min(1, "Name is required"),
  tags: z.string().min(1, "Tags is required"),
});
