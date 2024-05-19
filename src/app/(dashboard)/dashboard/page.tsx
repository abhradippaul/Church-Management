"use client";

import { useEffect, useState } from "react";

function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    isMounted && (
      <div className="pt-24">
        <h1>This is our dashboard page</h1>
      </div>
    )
  );
}

export default DashboardPage;
