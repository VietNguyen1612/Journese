"use client";

import UserActiveType from "@/components/User/UserActiveTypeLabel";
import { returnFormattedDate } from "@/hooks/regex";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  Table,
} from "react-bootstrap";

function Index() {
  const [ads, setAds] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const [reload, setReload] = useState(false);
  const [modalId, setModalId] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `http://localhost:3056/api/v1/ads?isValid=false&isPaid=false&isExpired=false`
      );
      setAds(res.data["metadata"]);
    };
    fetchData();
  }, [reload]);

  const returnExpriyDate = (dateString: string) => {
    let date = new Date(dateString);
    date.setDate(date.getDate() + 5);
    dateString = date.toString();
    return returnFormattedDate(dateString);
  };

  const validate = async ({
    id,
    isValid,
    msg,
  }: {
    id: string;
    isValid: boolean;
    msg?: string;
  }) => {
    const res = await axios.patch(`http://localhost:3056/api/v1/ads/validate`, {
      advertisementId: id,
      isValid: isValid,
      msg: msg ? msg : "",
    });
    if (res.data["statusCode"] == 200) {
      window.alert("validate success");
    } else {
      window.alert("error");
    }
  };

  const renderModal = (id: string) => {
    return (
      <Dialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <DialogTitle>Advertisement {id}</DialogTitle>
        <DialogContent>
          <strong>Rejecting reason:</strong>
          <TextField
            fullWidth
            multiline
            value={denyReason}
            id="firstName"
            name="firstName"
            type="text"
            onChange={(e) => setDenyReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await validate({ id: id, isValid: false, msg: denyReason });
              window.alert("validate success");
              setReload(!reload);
              setOpenModal(false);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleApprove = async (id: string) => {
    await validate({ id: id, isValid: true });

    setReload(!reload);
  };
  const handleReject = (id: string) => {
    setOpenModal(true);
    setModalId(id);
  };
  const columns = [
    {
      field: "image",
      headerName: "Photo",
      width: 320,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <img
          src={params.value}
          alt="Place"
          style={{ objectFit: "contain", height: "200px", width: "100%" }}
        />
      ),
    },
    {
      field: "userId",
      width: 200,
      headerName: "UserName",
      renderCell: (params: any) => (
        <Tooltip
          title={
            params.value
              ? `${
                  params.row.userId.firstName + " " + params.row.userId.lastName
                }`
              : ""
          }
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
            {params.row.userId.firstName + " " + params.row.userId.lastName}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 140,
      renderCell: (params: any) => (
        <div>{returnFormattedDate(params.row.createdAt)}</div>
      ),
      sortComparator: (v1: any, v2: any, cellParams1: any, cellParams2: any) =>
        new Date(v1).getTime() - new Date(v2).getTime(),
    },
    {
      field: "button",
      headerName: "Action",
      width: 230,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <div
          style={{
            display: "flex",
            alignContent: "center",
            gap: 15,
            justifyContent: "center",
            height: "100%",
          }}
        >
          <div
            style={{
              height: "fit-content",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleApprove(params.row._id)}
            >
              approve
            </Button>
          </div>
          <div
            style={{
              height: "fit-content",
            }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => handleReject(params.row._id)}
            >
              reject
            </Button>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="d-flex align-items-center justify-content-center">
      {openModal && renderModal(modalId)}
      {ads.length === 0 ? (
        <text>There is no advertisement</text>
      ) : (
        <Box sx={{ width: "95%" }}>
          <DataGrid
            rowHeight={220}
            rows={ads}
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
      )}
    </div>
  );
}

export default Index;
