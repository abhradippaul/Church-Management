import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";
const SignupForm = dynamic(() => import("@/my_components/Form/SignupForm"));

function page() {
  return (
    <Card className="w-[90%] max-w-[500px]">
      <CardHeader>
        <CardTitle>Signup Form</CardTitle>
        <CardDescription>Create an account</CardDescription>
      </CardHeader>
      <SignupForm
        email="Church Email"
        image="Upload Image"
        name="Church Name"
        password="Password"
      />
    </Card>
  );
}

export default page;
