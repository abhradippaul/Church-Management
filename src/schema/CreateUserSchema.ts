import { z } from "zod";

export default z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["male", "female", "others", ""]),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(10, "Phone number should be at least 10 digits"),
  email: z.string().email("Enter a valid email"),
});
