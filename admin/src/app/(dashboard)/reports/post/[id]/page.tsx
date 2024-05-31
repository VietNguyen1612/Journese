"use client"

import { returnFormattedDate } from "@/hooks/regex";
import { Alert, Box, Button, Card, CardContent, Grid, ImageList, ImageListItem, Snackbar, TextField, Typography } from "@mui/material";
import { GridArrowDownwardIcon } from "@mui/x-data-grid";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const ReportDetail = ({ params }: { params: { id: string } }) => {
    const [report, setReport] = useState<any>()
    const [adminComment, setAdminComment] = useState('');
    const [unblockIn, setUnblockIn] = useState(10);
    const [open, setOpen] = useState(false);
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleAutoClose = () => {
        setOpen(false)
    };
    const fetchData = async () => {
        const res = await axios.get(
            `http://localhost:3056/api/v1/report/view?type=Post&id=${params.id}`
        );
        setReport(res.data['metadata'])
    }
    useEffect(() => {

        fetchData()

    }, [])

    const handleResolveReport = async (id: string, status: string) => {
        const response = await axios.post(`http://localhost:3056/api/v1/report/response`, {
            reportId: id,
            state: status,
            adminComment: adminComment
        })
        fetchData()
        if (response.data['statusCode'] == 200) {
            setOpen(true)
        }
    }
    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClick={handleClose} onClose={handleAutoClose}>
                <Alert onClose={handleClose} severity="success">
                    Success!
                </Alert>
            </Snackbar>
            {report &&
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <CardContent>
                                            <Typography style={{ marginBottom: '10px' }} variant="h5" component="div">
                                                {report.user.firstName} {report.user.lastName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Phone: </strong>{report.user.phone}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Role: </strong>{report.user.role}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong> Valid: </strong>{report.user.isValid.toString()}
                                            </Typography>
                                            {/* <Typography variant="body2" color="text.secondary">
                                                CitizenId: {report.user.attributes.citizen_id.length > 0 ? report.user.attributes.citizen_id : "Empty"}
                                            </Typography> */}
                                        </CardContent>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <CardContent >

                                            <img style={{ height: 150, width: 150 }} src={report.user.avatarUrl} alt="User Avatar" />
                                        </CardContent>
                                    </Grid>
                                </Grid>
                            </Card>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
                                <GridArrowDownwardIcon />
                            </div>
                            <Card>

                                <CardContent>
                                    <Typography style={{ marginBottom: '10px' }} variant="h5" component="div">
                                        Post details
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" >
                                        <strong>User: </strong> {report.targetEntityId.userId.firstName} {report.targetEntityId.userId.lastName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Like: </strong> {report.targetEntityId.liked.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>State: </strong> {report.targetEntityId.isDeleted ? 'Deleted' : 'Normal'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Content: </strong>
                                        {report.targetEntityId.content}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <div><strong>Images: </strong></div>
                                    </Typography>
                                    <ImageList
                                        variant="quilted"
                                        cols={3}
                                        rowHeight={121}
                                    >
                                        {report['targetEntityId']['images'].map((item: any, index: number) => (
                                            <ImageListItem key={index} >
                                                <img
                                                    src={item}
                                                    loading="lazy"
                                                />
                                            </ImageListItem>
                                        ))}
                                    </ImageList>
                                </CardContent>


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

                                    {(report.state === 'approve' || report.state === 'reject') && (
                                        <>
                                            <Typography variant="body2" color="text.secondary">
                                                Admin Comment: {report.adminComment.length > 0 ? report.adminComment : 'Nothing'}
                                            </Typography>
                                        </>
                                    )}
                                    {report.state === 'pending' && (
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
                                    {report.state === 'pending' && (
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '10px' }}>
                                            <Button onClick={() => { handleResolveReport(report._id, 'approve') }} variant="contained" color="primary">
                                                Approve
                                            </Button>
                                            <Button onClick={() => { handleResolveReport(report._id, 'reject') }} variant="contained" color="error">
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            }

        </>
    );
};

export default ReportDetail;
