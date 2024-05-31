"use client";

import UserActiveType from "@/components/User/UserActiveTypeLabel";
import { returnFormattedDate } from "@/hooks/regex";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chip, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Table,
} from "react-bootstrap";

function Index() {
  const columns = [
    {
      field: "image",
      headerName: "Photo",
      width: 150,
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
      field: "userId",
      headerName: "UserName",
      width: 150,
      sortable: true,
      valueGetter: (params: any) => {
        return params.fullName;
      },
      renderCell: (params: any) => (
        <Tooltip
          title={params.row.userId.fullName ? params.row.userId.fullName : ""}
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
            {params.row.userId.fullName}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "isValid",
      headerName: "Valid",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <Chip
          label={params.row.isValid.toString()}
          style={{
            backgroundColor: params.row.isValid ? "green" : "red",
            color: "white",
          }}
        />
      ),
    },
    {
      field: "isPaid",
      headerName: "Paid",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <Chip
          label={params.row.isPaid.toString()}
          style={{
            backgroundColor: params.row.isPaid ? "green" : "red",
            color: "white",
          }}
        />
      ),
    },
    {
      field: "isExpired",
      headerName: "Expired",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <Chip
          label={params.row.isExpired.toString()}
          style={{
            backgroundColor: params.row.isExpired ? "green" : "red",
            color: "white",
          }}
        />
      ),
    },
    {
      field: "paidAt",
      headerName: "Paid At",
      width: 150,
      renderCell: (params: any) => (
        <div>{returnFormattedDate(params.row.paidAt)}</div>
      ),
      sortComparator: (v1: any, v2: any, cellParams1: any, cellParams2: any) =>
        new Date(v1).getTime() - new Date(v2).getTime(),
    },
    {
      field: "expiresAt",
      headerName: "Expires At",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <div>{returnExpriyDate(params.row.paidAt)}</div>
      ),
    },
  ];
  const [ads, setAds] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:3056/api/v1/ads`);
      console.log(res)
      // const filteredAds = res.data["metadata"].filter((ad: any) => {
      //   if (ad.paidAt && ad.paidAt !== null) return ad;
      // });
      setAds(res.data["metadata"]);
    };
    fetchData();
  }, []);
  console.log(JSON.stringify(ads));
  const returnExpriyDate = (dateString: string) => {
    let date = new Date(dateString);
    date.setDate(date.getDate() + 5);
    dateString = date.toString();
    return returnFormattedDate(dateString);
  };
  return (
    <div>
      <DataGrid
        rowHeight={120}
        rows={ads} // assuming 'ads' is your data
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        rowSelection={false}
        getRowId={(row: any) => row._id}
      />
    </div>
  );
}

export default Index;
