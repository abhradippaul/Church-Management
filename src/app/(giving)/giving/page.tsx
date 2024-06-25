import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";

const SigninForm = dynamic(() => import("@/my_components/Form/GivingForm"));

function Page() {
  return (
    <Card className="w-[90%] max-w-[500px]">
      <CardHeader>
        <CardTitle>Giving Form</CardTitle>
        <CardDescription>
          Submit giving form for cash transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SigninForm />
      </CardContent>
    </Card>
  );
}

export default Page;
