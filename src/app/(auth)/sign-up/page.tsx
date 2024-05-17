import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignupForm from "@/my_components/Form/SignupForm";

function page() {
  return (
    <Card className="w-[90%] max-w-[500px]">
      <CardHeader>
        <CardTitle>Signup Form</CardTitle>
        <CardDescription>Create an account</CardDescription>
      </CardHeader>
      <SignupForm />
    </Card>
  );
}

export default page;
