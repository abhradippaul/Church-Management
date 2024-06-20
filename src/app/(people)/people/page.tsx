import dynamic from "next/dynamic";
// import PeopleNavbar from "../PeopleNavbar";

const TableComponent = dynamic(() => import("@/components/TableComponent"));
const PeopleNavbar = dynamic(() => import("../PeopleNavbar"));

const tableHeading = ["Name", "Email", "Age", ""];

function Page() {
  return (
    <>
      <PeopleNavbar type="create" />
      <TableComponent type="people" tableHeading={tableHeading} />
    </>
  );
}

export default Page;
