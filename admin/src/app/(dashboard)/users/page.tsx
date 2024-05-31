"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserList from "@/components/User/UserList";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Tooltip } from "@mui/material";
import { returnFormattedDate } from "@/hooks/regex";

export default function Index() {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const fetchData = async () => {
    const userListURL = `http://localhost:3056/api/v1/user`;
    const data = await axios.get(userListURL);

    setUsers(data.data.metadata);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const columns = [
    {
      field: "avatarUrl",
      headerName: "Avatar",
      width: 170,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <img
          src={params.value}
          alt="Place"
          style={{ objectFit: "cover", height: "100px", width: "100px" }}
        />
      ),
    },
    {
      field: "fullname",
      headerName: "Full Name",
      width: 170,
      sortable: false,
      renderCell: (params: any) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.row.firstName + " " + params.row.lastName}
        </div>
      ),
    },
    {
      field: "phone",
      headerName: "Phone Number",
      width: 170,
      sortable: false,
      renderCell: (params: any) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "isValid",
      headerName: "Status",
      width: 150,
      sortable: true,
      renderCell: (params: any) => (
        <Tooltip
          title={params.value ? params.value : ""}
          enterDelay={500}
          enterNextDelay={500}
        >
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {params.value == true ? "Valid" : "Not valid"}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "updatedAt",
      headerName: "Create Date",
      width: 150,
      sortable: true,
      renderCell: (params: any) => (
        <div>{returnFormattedDate(params.row.createdAt)}</div>
      ),
      sortComparator: (v1: any, v2: any, cellParams1: any, cellParams2: any) =>
        new Date(v1).getTime() - new Date(v2).getTime(),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: any) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push(`users/${params.row._id}`)}
        >
          View Detail
        </Button>
      ),
    },
  ];
  return (
    <div className="d-flex align-items-center justify-content-center">
      <Box>
        <DataGrid
          rowHeight={120}
          rows={users}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          // pageSizeOptions={[10, 15]}
          rowSelection={false}
          getRowId={(row: any) => row._id}
        />
      </Box>
    </div>
  );
}
