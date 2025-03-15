"use client";
import DynamicTable1 from "@/components/DynamicTable copy";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import tabledata from "./dashboard_settings.json";
import DynamicTable from "@/components/DynamicTable copy";
import tableconfig from "@/public/tableconfig.json";
import DynamicTable12 from "@/components/NewDynamic";

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

      {/* <DynamicTable tableConfig={tableconfig?.table_config}></DynamicTable> */}
      <DynamicTable12 tableConfig={tableconfig?.table_config}></DynamicTable12>
      {/* <DynamicTable></DynamicTable> */}
    </div>
  );
}
