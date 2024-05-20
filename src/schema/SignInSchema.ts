import { z } from "zod";

export default z.object({
  email: z.string().email("Enter valid email."),
  password: z.string(),
});
