"use client"

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Avatar, Box, Card, CardContent, CardHeader, Container, Grid, List, ListItem, TextField, Typography, ImageList, ImageListItem, Select, MenuItem, InputLabel, Stack, Chip } from "@mui/material";
import { VIETNAM_PROVINCES } from "@/hooks/regex";

const Index = ({ params }: { params: { id: string } }) => {
  const [user, setUser] = useState<any>()
  const router = useRouter()
  const fetchData = async () => {
    const userListURL = `http://localhost:3056/api/v1/user/${params.id}`;
    const data = await axios.get(userListURL)
    setUser(data.data['metadata'])
  }
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Container>
      {user &&
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title="User Details"
              //  action={
              //   <Button variant="contained" color="primary" onClick={() => { }}>
              //     Block
              //   </Button>
              // } 
              />
              <CardContent>
                <List>
                  {user.isBlock ?
                    <ListItem>
                      <strong style={{ color: 'red' }}>This user has been blocked</strong>
                    </ListItem>
                    : <></>}
                  <ListItem>
                    <span style={{ width: '150px' }}> <strong>Name:</strong></span>
                    {user.firstName + user.lastName}
                  </ListItem>
                  <ListItem>
                    <span style={{ width: '150px' }}> <strong>Phone:</strong></span>
                    {user['phone']}
                  </ListItem>

                  <ListItem>
                    <span style={{ width: '150px' }}> <strong>Active:</strong></span>
                    {user['isActive'].toString()}
                  </ListItem>
                  <ListItem>
                    <span style={{ width: '150px' }}> <strong>Valid:</strong></span>
                    {user['isValid'].toString()}
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="User Images" />
              <CardContent>
                <ImageList
                  variant="quilted"
                  cols={2}
                  rowHeight={121}
                >
                  {user['attributes']['images'].map((item: any, index: number) => (
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

        </Grid>
      }
    </Container>
  );
};

export default Index;
