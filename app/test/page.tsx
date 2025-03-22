"use client"; // 👈 Add this at the very top

import { useState } from "react";

interface CSVData {
  [key: string]: string;
}

export default function TestPage() {
  // 👈 Ensure function name is valid
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<CSVData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setLoading(false);

      if (result.success) {
        setData(result.data);
      } else {
        alert("Upload failed!");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Error uploading file.");
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">CSV Upload</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="my-2"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {data?.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xl font-semibold">Parsed Data:</h2>
          <pre className="bg-gray-200 p-3">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
