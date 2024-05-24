import dynamic from "next/dynamic";

const TableComponent = dynamic(() => import("@/components/TableComponent"));

const tableHeading = ["Name", "Email", "Age", ""];

function page() {
  return <TableComponent type="people" tableHeading={tableHeading} />;
}

export default page;
