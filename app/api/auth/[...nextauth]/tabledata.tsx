import { NextApiRequest, NextApiResponse } from "next";

// Dummy data for testing (Replace this with DB call)
const tableData = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Admin",
    status: "Active",
    created_at: "2024-01-15",
  },
  {
    id: 2,
    name: "Bob Williams",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
    created_at: "2024-02-10",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Manager",
    status: "Suspended",
    created_at: "2023-12-20",
  },
  {
    id: 6,
    name: "Franklin Harris",
    email: "franklin@example.com",
    role: "Manager",
    status: "Active",
    created_at: "2023-10-12",
  },
  {
    id: 7,
    name: "Grace Miller",
    email: "grace@example.com",
    role: "User",
    status: "Suspended",
    created_at: "2023-09-30",
  },
  {
    id: 4,
    name: "David Smith",
    email: "david@example.com",
    role: "User",
    status: "Active",
    created_at: "2023-11-05",
  },
  {
    id: 5,
    name: "Emma White",
    email: "emma@example.com",
    role: "Admin",
    status: "Inactive",
    created_at: "2024-02-25",
  },
  {
    id: 8,
    name: "Henry Clark",
    email: "henry@example.com",
    role: "Admin",
    status: "Active",
    created_at: "2024-01-05",
  },
  {
    id: 9,
    name: "Ivy Adams",
    email: "ivy@example.com",
    role: "Manager",
    status: "Inactive",
    created_at: "2023-08-22",
  },
  {
    id: 10,
    name: "Jack Roberts",
    email: "jack@example.com",
    role: "User",
    status: "Active",
    created_at: "2023-07-18",
  },
  {
    id: 11,
    name: "Katherine Lewis",
    email: "katherine@example.com",
    role: "Admin",
    status: "Suspended",
    created_at: "2023-06-15",
  },
  {
    id: 12,
    name: "Liam Walker",
    email: "liam@example.com",
    role: "Manager",
    status: "Active",
    created_at: "2023-05-20",
  },
  {
    id: 13,
    name: "Mia Scott",
    email: "mia@example.com",
    role: "User",
    status: "Inactive",
    created_at: "2023-04-25",
  },
  {
    id: 14,
    name: "Noah Parker",
    email: "noah@example.com",
    role: "Admin",
    status: "Active",
    created_at: "2023-03-10",
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page = "1", pageSize = "10", search = "" } = req.query;

  // Convert query params
  const pageNum = parseInt(page as string, 10);
  const pageSizeNum = parseInt(pageSize as string, 10);

  // Filter by search (optional)
  const filteredData = tableData.filter(
    (row) =>
      row.name.toLowerCase().includes((search as string).toLowerCase()) ||
      row.email.toLowerCase().includes((search as string).toLowerCase())
  );

  // Pagination
  const paginatedData = filteredData.slice(
    (pageNum - 1) * pageSizeNum,
    pageNum * pageSizeNum
  );

  res.status(200).json({
    data: paginatedData,
    total_records: filteredData.length,
    total_pages: Math.ceil(filteredData.length / pageSizeNum),
    current_page: pageNum,
  });
}
