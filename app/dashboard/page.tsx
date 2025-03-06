"use client";
import DynamicTable from "@/components/DynamicTable";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import tabledata from "./dashboard_settings.json";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [tableData, setTableData] = useState(tabledata);
  const router = useRouter();

  // if (status === "loading") {
  //   return <p>Loading...</p>;
  // }

  // if (!session) {
  //   router.push("/login"); // Redirect to login if not authenticated
  // }else{
  // }

  return (
    <div className="p-4">
      {/* <p>Your email: {session?.user?.email}</p> */}
      {/* <button onClick={() => signOut()}>Logout</button> */}
      {/* <CustomTable data={tabledata} setData={setTableData} /> */}
      {/* <CustomTable2  data={tabledata}></CustomTable2> */}
      {/* <ReusableTable config={tabledata} /> */}

      <DynamicTable></DynamicTable>
    </div>
  );
}
