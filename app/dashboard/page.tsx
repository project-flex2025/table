"use client";
import CustomTable2 from "@/components/CustomTable";
import CustomTable from "@/components/Table";
import CustomizedTables from "@/components/Table";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import tabledata from "./dashboard_settings.json";
import { useState } from "react";
import ReusableTable from "@/components/FunTable";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [tableData, setTableData] = useState(tabledata);
  const router = useRouter();  

  if (status === "loading") {
    return <p>Loading...</p>;
  }  

  if (!session) {
    router.push("/login"); // Redirect to login if not authenticated
  }else{
  }

  return (
    <div className="p-4">
      {/* <p>Your email: {session?.user?.email}</p> */}
      {/* <button onClick={() => signOut()}>Logout</button> */}
      <CustomTable  data={tabledata} setData={setTableData} />
      {/* <CustomTable2  data={tabledata}></CustomTable2> */}
      {/* <ReusableTable config={tabledata} /> */}

    </div>
  );
}
