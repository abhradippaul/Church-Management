function page({ params }: { params: { peopleId: string } }) {
  console.log(params);
  return <div>route</div>;
}

export default page;
