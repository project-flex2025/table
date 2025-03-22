"use client";
import DynamicTable1 from "@/components/DynamicTable copy";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import tabledata from "./dashboard_settings.json";
import DynamicTable from "@/components/DynamicTable copy";
import tableconfig from "@/public/tableconfig.json";
import config1 from "@/public/newtableconfig.json";
import config2 from "@/public/vijaytable.json";
import DynamicTable12 from "@/components/NewDynamic";
import { Button } from "@mui/material";
import DynamicF from "@/components/Tablef";
import DynamicTableFuncopy from "@/components/Tablef copy";
import DynamicTableFun2 from "../../components/Tablef copy";
import DynamicTableFun123 from "@/components/Tablef copy 2";
// import { TableConfig } from "@/types"; // Assuming you have a type for tableConfig

// {
//   "conditions": [
//   {
//   "field": "feature_name",
//   "value": "Document Editor",
//   "search_type": "exact"
//   }
//   ],
//   "combination_type": "and",
//   "page": 1,
//   "limit": 5,
//   "dataset": "features",
//   "app_secret": "38475203487kwsdjfvb1023897yfwbhekrfj"
//   }

async function fetchData() {
  const formData = new FormData();

  const postJson = {
    conditions: [
      {
        field: "feature_name",
        value: "employees",
        search_type: "exact",
      },
    ],
    combination_type: "and",
    page: 1,
    limit: 100,
    dataset: "feature_data",
    app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
  };

  formData.append("post_json", JSON.stringify(postJson));
  formData.append("download_type", "csv");
  formData.append("user_id", "366");

  try {
    const response = await fetch("/api/aws_s3", {
      method: "POST",
      headers: {
        Authorization: "Bearer YOUR_ACCESS_TOKEN", // If required
        Accept: "application/json", // To accept JSON responses
      },
      body: formData,
    });

    const data = await response.json();

    // Destructure `download_url`
    const { download_url } = data;

    if (download_url) {
      console.log("Download URL:", download_url);
      window.location.href = download_url; // Automatically start download
    } else {
      console.error("Download URL not found in response", data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call fetchData when needed, for example, on button click

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [tableData, setTableData] = useState(tabledata);
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   fetchData()
  //     .then((res: any) => {
  //       setData(res.data);
  //       setLoading(false);
  //     })
  //     .catch((err: any) => {
  //       setError(err.message);
  //       setLoading(false);
  //     });
  // }, []);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;

  const search = "vi"; // Assign search value dynamically

  const filters = [
    {
      field: "feature_name",
      value: "emp",
      search_type: "exact",
    },
    ...(search
      ? [
          {
            field: "feature_data.record_data.record_value_text",
            value: `*${search}*`,
            search_type: "wildcard",
          },
        ]
      : []),
  ];

  console.log("config1", config2?.table_config);

  return (
    <div className="p-4">
      {/* <Button variant="contained" onClick={() => fetchData()}>
        Download Employees
      </Button> */}
      {/* <DynamicTable1></DynamicTable1> */}
      {/* <p>Your email: {session?.user?.email}</p> */}
      {/* <button onClick={() => signOut()}>Logout</button> */}
      {/* <CustomTable data={tabledata} setData={setTableData} /> */}
      {/* <CustomTable2  data={tabledata}></CustomTable2> */}
      {/* <ReusableTable config={tabledata} /> */}

      {/* <DynamicTable tableConfig={tableconfig?.table_config}></DynamicTable> */}
      {/* <DynamicTable12 tableconfig={config2?.table_config}></DynamicTable12> */}
      {/* <DynamicF tableconfig={config2?.table_config}></DynamicF> */}
      {/* <DynamicTableFuncopy
        tableconfig={config2?.table_config}
      ></DynamicTableFuncopy> */}
      <DynamicTableFun2 tableconfig={config2?.table_config}></DynamicTableFun2>
      {/* <DynamicTableFun123
        tableconfig={config2?.table_config}
      ></DynamicTableFun123> */}
      {/* <DynamicTable></DynamicTable> */}
    </div>
  );
}
