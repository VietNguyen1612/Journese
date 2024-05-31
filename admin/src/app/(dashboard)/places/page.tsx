"use client";

import { Tooltip, Button, Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const userListURL = `http://localhost:3056/api/v1/place/admin/page`;
      const data = await axios.get(userListURL);

      setPlaces(data.data.metadata.reverse());
    };
    fetchData();
  }, []);
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 170,
      renderCell: (params: any) => (
        <Tooltip
          title={params.value ? params.value.toString() : ""}
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
    { field: "type", headerName: "Type", width: 130 },
    {
      field: "address",
      headerName: "Address",
      width: 200,
      renderCell: (params: any) => (
        <Tooltip
          title={params.value ? params.value.toString() : ""}
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
      field: "phone",
      headerName: "Phone",
      width: 150,
      renderCell: (params: any) => (
        <Tooltip
          title={params.value ? params.value.toString() : ""}
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
            {params.value ? params.value : 'No number'}
          </div>
        </Tooltip>
      ),
    },
    // {
    //   field: 'website', headerName: 'Website', width: 130,
    //   renderCell: (params: any) => (
    //     <Tooltip title={params.value ? params.value.toString() : ''} enterDelay={500} enterNextDelay={500}>
    //       <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
    //         {params.value}
    //       </div>
    //     </Tooltip>
    //   ),
    // },
    {
      field: "images",
      headerName: "Images",
      width: 170,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <img
          src={params.value[0]}
          alt="Place"
          style={{ objectFit: "cover", height: "140px", width: "140px" }}
        />
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
          onClick={() => router.push(`/places/${params.row.place_id}`)}
        >
          View Detail
        </Button>
      ),
    },
  ];
  return (
    <>
      <Button
        style={{ marginBottom: "15px" }}
        onClick={() => router.push("./add-place")}
      >
        Add place
      </Button>
      <div className='d-flex align-items-center justify-content-center'>
        <Box>
          <DataGrid
            rowHeight={160}
            rows={places}
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
    </>
  );
};

export default PlacesPage;
