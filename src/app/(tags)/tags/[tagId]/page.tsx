import dynamic from "next/dynamic";
const tableHeading = ["Name", "Email", "Age", ""];

const TableComponent = dynamic(() => import("@/components/TableComponent"));

async function page() {
  return (
    <div>
      <TableComponent type="tagpeople" tableHeading={tableHeading} />
    </div>
  );
}

export default page;
