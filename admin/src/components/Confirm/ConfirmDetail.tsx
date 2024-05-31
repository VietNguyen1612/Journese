"use client";
import { Button, Avatar, Box, Card, CardContent, CardHeader, Container, Grid, List, ListItem, TextField, Typography } from "@mui/material";
import axios from "axios";
// import { redirect } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const ConfirmDetail = (props: any) => {
  const {
    _id,
    user,
    avatarUrl: initialAvatarUrl,
    status: initialStatus,
    phone: initialPhone,
    firstName: initialFirstName,
    lastName: initialLastName,
    email,
    dob: initialDob,
    citizen_id: initialCitizenId,
    citizen_images,
    createdAt,
    updatedAt,
  } = props.metadata;

  const [phone, setPhone] = useState(initialPhone);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [dob, setDob] = useState(initialDob);
  const [citizen_id, setCitizenId] = useState(initialCitizenId);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);

  const handleApprove = async () => {
    // console.log('ccc')
    "use client";
    const res = await fetch(
      `http://localhost:3056/api/v1/user/update/${user}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Send data as JSON
        },
        body: JSON.stringify({
          phone: phone,
          firstName: firstName,
          lastName: lastName,
          attributes: {
            citizen_id: citizen_id,
          },
          avatarUrl: avatarUrl,
        }),
        cache: "no-cache",
      }
    ).then((res) => console.log(res));

    const response = await fetch(
      "http://localhost:3056/api/v1/confirm/approved",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Send data as JSON
        },
        body: JSON.stringify({ id: _id }),
        cache: "no-cache",
      }
    );
    window.location.reload();
  };

  const handleReject = async () => {
    const response = await axios.post(`http://localhost:3056/api/v1/confirm/reject`, {
      id: _id
    })
    window.location.reload();
  }
  return (
    <Container>
      {initialStatus === "pending" ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title="User Details" />
              <CardContent>
                <List>
                  <ListItem>
                    <span style={{ width: "150px" }}>
                      {" "}
                      <strong>User ID:</strong>
                    </span>
                    {user}
                  </ListItem>
                  <ListItem>
                    <Box
                      width={"100%"}
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ width: "150px" }}>
                          {" "}
                          <strong>Avatar:</strong>
                        </span>
                        {avatarUrl && <Avatar src={avatarUrl} alt="Avatar" />}
                      </div>
                    </Box>
                  </ListItem>
                  <ListItem>
                    <span style={{ width: "150px" }}>
                      {" "}
                      <strong>Status:</strong>
                    </span>
                    {initialStatus}
                  </ListItem>
                  <ListItem>
                    <span style={{ width: "150px" }}>
                      {" "}
                      <strong>Phone:</strong>
                    </span>
                    {phone}
                  </ListItem>
                  <ListItem>
                    <span style={{ width: "150px" }}>
                      {" "}
                      <strong>First Name:</strong>
                    </span>
                    <TextField
                      value={firstName}
                      id="firstName"
                      name="firstName"
                      type="text"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </ListItem>
                  <ListItem>
                    <span style={{ width: "150px" }}>
                      {" "}
                      <strong>Last Name:</strong>
                    </span>
                    <TextField
                      value={lastName}
                      id="lastName"
                      name="lastName"
                      type="text"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </ListItem>
                  {/* <ListItem>
                    <span style={{ width: "150px" }}>
                      {" "}
                      <strong>Date Of Birth:</strong>
                    </span>
                    <TextField
                      value={dob}
                      id="dob"
                      name="dob"
                      type="date"
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </ListItem>
                  <ListItem>
                    <span style={{ width: "150px" }}>
                      {" "}
                      <strong>CitizenId:</strong>
                    </span>
                    <TextField
                      value={citizen_id}
                      id="citizenId"
                      name="citizenId"
                      type="text"
                      onChange={(e) => setCitizenId(e.target.value)}
                    />
                  </ListItem> */}
                </List>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "1rem",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleApprove}
                  >
                    Approve
                  </Button>
                  <Button variant="contained" color="error" onClick={handleReject}>
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Verify Image" />
              <CardContent>
                <List>
                  {citizen_images.map((imageUrl: string, index: number) => (
                    <ListItem key={index}>
                      <img
                        src={imageUrl}
                        alt={`Citizen ID Image ${index + 1}`}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title="User Details" />
              <CardContent>
                <List>
                  <ListItem>
                    <span style={{ width: "150px" }}>
                      {" "}
                      <strong>User ID:</strong>
                    </span>
                    {user}
                  </ListItem>
                  <ListItem>
                    <Box
                      width={"100%"}
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ width: "150px" }}>
                          {" "}
                          <strong>Avatar:</strong>
                        </span>
                        {avatarUrl && <Avatar src={avatarUrl} alt="Avatar" />}
                      </div>
                    </Box>
                  </ListItem>
                  <ListItem>
                    <span style={{ width: "150px" }}>
                      {" "}
                      <strong>Status:</strong>
                    </span>
                    {initialStatus}
                  </ListItem>
                  <ListItem>
                    <span style={{ width: "150px" }}>
                      {" "}
                      <strong>Phone:</strong>
                    </span>
                    {phone}
                  </ListItem>
                  <ListItem>
                    <span style={{ width: "150px" }}>
                      {" "}
                      <strong>First Name:</strong>
                    </span>
                    {firstName}
                  </ListItem>
                  <ListItem>
                    <span style={{ width: "150px" }}>
                      {" "}
                      <strong>Last Name:</strong>
                    </span>
                    {lastName}
                  </ListItem>
                  {/* <ListItem>
                    <span style={{ width: "150px" }}>
                      {" "}
                      <strong>Date Of Birth:</strong>
                    </span>
                    {dob}
                  </ListItem>
                  <ListItem>
                    <span style={{ width: "150px" }}>
                      {" "}
                      <strong>CitizenId:</strong>
                    </span>
                    {citizen_id}
                  </ListItem> */}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Verify Image" />
              <CardContent>
                <List>
                  {citizen_images.map((imageUrl: string, index: number) => (
                    <ListItem key={index}>
                      <img
                        src={imageUrl}
                        alt={`Citizen ID Image ${index + 1}`}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default ConfirmDetail;
