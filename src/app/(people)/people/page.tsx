import dynamic from "next/dynamic";

const TableComponent = dynamic(() => import("@/components/TableComponent"));
const UserCreateDialog = dynamic(() => import("../UserCreateDialog"));

const tableHeading = ["Name", "Email", "Age", ""];
const tableRow = [
  {
    imageUrl: "abc",
    name: "Abhradip",
    email: "abc@gmail.com",
    age: "22",
  },
];

function page() {
  return (
    <div className="pt-24 flex flex-col">
      <div className="mb-8 mt-4 flex items-center justify-between">
        <h1 className="text-lg text-zinc-200">
          {tableRow.length} people found
        </h1>
        <UserCreateDialog />
      </div>
      <TableComponent
        type="people"
        tableHeading={tableHeading}
        tableRow={tableRow}
      />
    </div>
  );
}

export default page;
