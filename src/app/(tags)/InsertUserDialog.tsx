import DialogComponent from "@/components/DialogComponent";
import InsertUserToTagForm from "@/my_components/Form/InsertUserToTagForm";

function InsertNewUserToTagDialog() {
  return (
    <DialogComponent
      dialogTrigger={
        <div className="text-lg flex items-center justify-between max-w-[200px] font-semibold text-zinc-300 hover:text-white border hover:bg-white/5 rounded-md px-4 py-2 transition">
          Add user
        </div>
      }
      dialogTitle="Insert user"
      dialogDescription="Insert one or multiple user in the tag"
      dialogContent={<InsertUserToTagForm />}
    />
  );
}

export default InsertNewUserToTagDialog;
