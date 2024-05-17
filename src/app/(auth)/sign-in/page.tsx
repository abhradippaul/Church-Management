import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SigninForm from "@/my_components/Form/SigninForm";

function page() {
  return (
    <Card className="w-[90%] max-w-[500px]">
      <CardHeader>
        <CardTitle>Signin Form</CardTitle>
        <CardDescription>Sign in here to go to the dashboard</CardDescription>
      </CardHeader>
      <SigninForm />
    </Card>
  );
}

export default page;
