import dynamic from "next/dynamic";
import { Plus } from "lucide-react";

const DialogComponent = dynamic(() => import("@/components/DialogComponent"));
const UserCreateForm = dynamic(() => import("./UserCreateForm"));

function UserCreateDialog() {
  return (
    <DialogComponent
      dialogTrigger={
        <div className="text-lg flex items-center justify-between max-w-[200px] font-semibold text-zinc-300 hover:text-white border hover:bg-white/5 rounded-md px-4 py-2 transition">
          <Plus className="size-6 mr-2" />
          Add Person
        </div>
      }
      dialogTitle="Create a new user"
      dialogDescription="Create a new user who has visited the church"
      dialogContent={<UserCreateForm />}
    />
  );
}

export default UserCreateDialog;
