"use client";

import { returnFormattedDate } from "@/hooks/regex";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { GridArrowDownwardIcon } from "@mui/x-data-grid";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const ReportDetail = ({ params }: { params: { id: string } }) => {
  const [report, setReport] = useState<any>();
  const [adminComment, setAdminComment] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleAutoClose = () => {
    setOpen(false);
  };
  const fetchData = async () => {
    const res = await axios.get(
      `http://localhost:3056/api/v1/report/view?type=User&id=${params.id}`
    );
    setReport(res.data["metadata"]);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleResolveReport = async (id: string, status: string) => {
    const response = await axios.post(
      `http://localhost:3056/api/v1/report/response`,
      {
        reportId: id,
        state: status,
        adminComment: adminComment,
        reason: report.details,
      }
    );
    fetchData();
    if (response.data["statusCode"] == 200) {
      setOpen(true);
    }
  };
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClick={handleClose}
        onClose={handleAutoClose}
      >
        <Alert onClose={handleClose} severity="success">
          Success!
        </Alert>
      </Snackbar>
      {report && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <Grid container spacing={5}>
                  <Grid item xs={12} md={6}>
                    <CardContent>
                      <Typography
                        style={{ marginBottom: "10px" }}
                        component="div"
                      >
                        {report.user.firstName} {report.user.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Phone: {report.user.phone}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Role: {report.user.role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Valid: {report.user.isValid.toString()}
                      </Typography>
                      {/* <Typography variant="body2" color="text.secondary">
                        CitizenId: {report.user.attributes.citizen_id.length > 0 ? report.user.attributes.citizen_id.length : "Empty"}
                      </Typography> */}
                    </CardContent>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CardContent>
                      <img
                        style={{ height: 150, width: 150 }}
                        src={report.user.avatarUrl}
                        alt="User Avatar"
                      />
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "20px",
                }}
              >
                <GridArrowDownwardIcon />
              </div>
              <Card>
                <Grid container spacing={5}>
                  <Grid item xs={12} md={6}>
                    <CardContent>
                      <Typography
                        style={{ marginBottom: "10px" }}
                        component="div"
                      >
                        {report.targetEntityId.firstName}{" "}
                        {report.targetEntityId.lastName}
                        {report.targetEntityId.isBlock && (
                          <span> (Blocked)</span>
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Phone: {report.targetEntityId.phone}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Role: {report.targetEntityId.role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Valid: {report.targetEntityId.isValid.toString()}
                      </Typography>
                      {/* <Typography variant="body2" color="text.secondary">
                        CitizenId: {report.targetEntityId.attributes.citizen_id.length > 0 ? report.targetEntityId.attributes.citizen_id.length : "Empty"}
                      </Typography> */}
                    </CardContent>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CardContent>
                      <img
                        style={{ height: 150, width: 150 }}
                        src={report.targetEntityId.avatarUrl}
                        alt="User Avatar"
                      />
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Report Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    State: {report.state}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created At: {returnFormattedDate(report.created)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Details: {report.details}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Evidence:
                  </Typography>
                  <img
                    style={{ height: 250, width: 250 }}
                    src={report.images[0]}
                    alt="Evidence"
                  />
                  {report.state === "approve" && (
                    <Typography variant="body2" color="text.secondary">
                      Resolve At: {returnFormattedDate(report.block.createdAt)}
                    </Typography>
                  )}

                  {report.state === "pending" && (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Admin Comment:
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        defaultValue={report.adminComment}
                        value={adminComment}
                        onChange={(e) => setAdminComment(e.target.value)}
                      />
                    </>
                  )}
                  {report.state === "approve" && (
                    <Typography variant="body2" color="text.secondary">
                      Admin Comment: {report.adminComment}
                    </Typography>
                  )}
                  {report.state === "pending" && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "1rem",
                        marginTop: "10px",
                      }}
                    >
                      <Button
                        onClick={() => {
                          handleResolveReport(report._id, "approve");
                        }}
                        variant="contained"
                        color="primary"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => {
                          handleResolveReport(report._id, "reject");
                        }}
                        variant="contained"
                        color="error"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default ReportDetail;
