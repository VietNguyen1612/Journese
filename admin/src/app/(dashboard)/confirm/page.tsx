"use client"
import { returnFormattedDate } from "@/hooks/regex";
import { Box, Button, Chip, Container, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

const ConfirmPage = () => {
  const router = useRouter()
  const [confirms, setConfirms] = useState<any[]>([])
  const fetchData = async () => {

    let res = await axios.get(`http://localhost:3056/api/v1/confirm/all`, {
    });
    setConfirms(res.data.metadata)
  }
  useEffect(() => {
    fetchData()
    return () => {
      setConfirms([])
    }
  }, [])
  const columns = [
    {
      field: 'avatarUrl',
      headerName: 'Photo',
      width: 170,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <img src={params.value} alt="Place" style={{ objectFit: 'cover', height: '100px', width: '100px' }} />
      ),
    },
    {
      field: 'fullname',
      headerName: 'Full Name',
      width: 170,
      sortable: false,
      renderCell: (params: any) => (
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {params.row.firstName + ' ' + params.row.lastName}
        </div>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      sortable: true,
      renderCell: (params: any) => (
        <Tooltip title={params.value ? params.value : ''} enterDelay={500} enterNextDelay={500}>
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Chip
              label={params.value}
              style={{
                backgroundColor: params.value === 'pending' ? 'blue' :
                  params.value === 'approved' ? 'green' : 'red',
                color: 'white',
              }}
            />

          </div>
        </Tooltip>
      )
    },
    {
      field: 'updatedAt',
      headerName: 'Last Update',
      width: 150,
      sortable: true,
      renderCell: (params: any) => (
        <div>
          {returnFormattedDate(params.row.updatedAt)}
        </div>
      ),
      sortComparator: (v1: any, v2: any, cellParams1: any, cellParams2: any) => new Date(v1).getTime() - new Date(v2).getTime(),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: any) => (
        <Button variant="contained" color="primary" onClick={() => router.push(`confirm/${params.row._id}`)}>
          View Detail
        </Button>
      ),
    },
  ];
  return (

    <div className='d-flex align-items-center justify-content-center'>
      {confirms &&
        <Box>
          <DataGrid
            rowHeight={120}
            rows={confirms} // assuming 'ads' is your data
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
      }
    </div>
  );
};

export default ConfirmPage;
