"use client";
import { Box, Button, Chip, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

const ReportPage = () => {
  const router = useRouter();
  const [reports, setReports] = useState<Array<any>>([]);
  useEffect(() => {
    const fetchData = async () => {
      let res = await axios.get(
        `http://localhost:3056/api/v1/report/all?type=User`,
        {}
      );
      setReports(res.data.metadata);
    };
    fetchData();
    return () => {
      setReports([]);
    };
  }, []);
  const columns = [
    {
      field: "user",
      headerName: "Reporter",
      width: 150,
      sortable: true,
      valueGetter: (params: any) => {
        return params.fullName;
      },
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
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "targetPhoto",
      headerName: "Reported User Photo",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <img
          src={params.row.targetEntityId.avatarUrl}
          alt="Place"
          style={{ objectFit: "cover", height: "100px", width: "100px" }}
        />
      ),
    },
    {
      field: "targetEntityId",
      headerName: "Reported User",
      width: 150,
      sortable: true,
      valueGetter: (params: any) => {
        return params.fullName;
      },
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
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    // {
    //   field: 'details',
    //   headerName: 'Content',
    //   width: 150,
    //   sortable: true,
    //   renderCell: (params: any) => (
    //     <Tooltip title={params.value ? params.value : ''} enterDelay={500} enterNextDelay={500}>
    //       <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
    //         {params.value}
    //       </div>
    //     </Tooltip>
    //   )
    // },
    {
      field: "state",
      headerName: "State",
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
            <Chip
              label={params.value}
              style={{
                backgroundColor: params.value === 'pending' ? 'blue' :
                  params.value === 'approve' ? 'green' : 'red',
                color: 'white',
              }}
            />
          </div>
        </Tooltip>
      ),
    },
    {
      field: "images",
      headerName: "Evidence",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <>
          {params.row.images[0] ? (
            <img
              src={params.row.images[0]}
              alt="Place"
              style={{ objectFit: "cover", height: "100px", width: "100px" }}
            />
          ) : (
            <span>No image</span>
          )}
        </>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push(`reports/${params.row._id}`)}
        >
          View Detail
        </Button>
      ),
    },
  ];

  return (
    <div className='d-flex align-items-center justify-content-center'>
      <Box>
        <DataGrid
          rowHeight={120}
          rows={reports} // assuming 'ads' is your data
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          rowSelection={false}
          getRowId={(row: any) => row._id}
        />
      </Box>
    </div>
  );
};

export default ReportPage;
