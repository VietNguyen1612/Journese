"use client"

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Avatar, Box, Card, CardContent, CardHeader, Container, Grid, List, ListItem, TextField, Typography, ImageList, ImageListItem, Select, MenuItem, InputLabel, Stack, Chip } from "@mui/material";
import { VIETNAM_PROVINCES } from "@/hooks/regex";

const Index = ({ params }: { params: { id: string } }) => {
    const [place, setPlace] = useState<any>()
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [long, setLong] = useState('')
    const [lat, setLat] = useState('')
    const [province, setProvince] = useState('')
    const [tags, setTags] = useState<any[]>([]);
    const [selectTags, setSelectTags] = useState<any[]>([]);
    const [images, setImages] = useState<any[]>([]);
    const router = useRouter()
    const fetchData = async () => {
        const res = await axios.get(
            `http://localhost:3056/api/v1/tag`
        )
        setTags(res.data['metadata'])
        const userListURL = `http://localhost:3056/api/v1/place/get-place/${params.id}`;
        const data = await axios.get(userListURL)
        console.log(data.data)
        setPlace(data.data.metadata)
        setName(data.data.metadata['name'])
        setPhone(data.data.metadata['phone'])
        setAddress(data.data.metadata['address'])
        setCity(data.data.metadata['city'].length > 0 ? data.data.metadata['city'] : 'Empty')
        setLong(data.data.metadata['geolocation']['coordinates'][0])
        setLat(data.data.metadata['geolocation']['coordinates'][1])
        setProvince(data.data.metadata['province'])
        setSelectTags(data.data.metadata['tags'])
        setImages(data.data.metadata['images'])
    }
    useEffect(() => {
        fetchData()
    }, [])

    const handleImageUrlChange = (newUrl: string, index: number) => {
        setImages(images.map((imageUrl, i) => i === index ? newUrl : imageUrl));
    };
    const handleAddImage = () => {
        setImages([...images, '']);
    };

    const handleUpdatePlace = async () => {
        try {
            const tagIds = selectTags.map((item) => item._id)
            const place = {
                place_id: params.id,
                name: name,
                phone: phone,
                address: address,
                city: city,
                geolocation: {
                    type: "Point",
                    coordinates: [long, lat]
                },
                province: province,
                tags: tagIds,
                images: images
            }
            const tagNames = selectTags.map((item) => item.name)
            const response = await axios.patch(`http://localhost:3056/api/v1/place`, place);
            const responseML = await axios.post(`https://exotic-filly-publicly.ngrok-free.app/places`, {
                "id": params.id,
                "title": name,
                "tags": tagNames
            });
            console.log(response.data)
            console.log(responseML.data)
            await fetchData()
            setEdit(false)
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <Container>
            {place &&
                <>
                    {edit == true
                        ? <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <Card>
                                    <CardHeader title="Place Details" />
                                    <CardContent>
                                        <List>
                                            <ListItem>
                                                <span style={{ width: '150px' }}> <strong>Place ID:</strong></span>
                                                {place['place_id']}
                                            </ListItem>
                                            <ListItem>
                                                <span style={{ width: '150px' }}> <strong>Name:</strong></span>
                                                <TextField
                                                    value={name}
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <span style={{ width: '150px' }}> <strong>City:</strong></span>
                                                <TextField
                                                    value={city}
                                                    id="city"
                                                    name="city"
                                                    type="text"
                                                    onChange={(e) => setCity(e.target.value)}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <div style={{ display: 'flex', width: '100%' }}>
                                                    <span style={{ width: '150px', flexShrink: 0 }}>
                                                        <strong>Address:</strong>
                                                    </span>
                                                    <TextField
                                                        multiline
                                                        style={{ width: '100%' }}
                                                        fullWidth
                                                        value={address}
                                                        id="address"
                                                        name="address"
                                                        type="text"
                                                        onChange={(e) => setAddress(e.target.value)}
                                                    />

                                                </div>
                                            </ListItem>
                                            <ListItem>
                                                <span style={{ width: '150px' }}> <strong>Phone:</strong></span>
                                                <TextField
                                                    value={phone}
                                                    id="phone"
                                                    name="phone"
                                                    type="text"
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <span style={{ width: '150px' }}> <strong>Long:</strong></span>
                                                <TextField
                                                    value={long}
                                                    id="long"
                                                    name="long"
                                                    type="text"
                                                    onChange={(e) => setLong(e.target.value)}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <span style={{ width: '150px' }}> <strong>Lat:</strong></span>
                                                <TextField
                                                    value={lat}
                                                    id="lat"
                                                    name="lat"
                                                    type="text"
                                                    onChange={(e) => setLat(e.target.value)}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <span style={{ width: '150px' }}> <strong>Province:</strong></span>
                                                <Select
                                                    value={province}
                                                    onChange={(e) => setProvince(e.target.value)}
                                                >
                                                    {Object.entries(VIETNAM_PROVINCES).map(([key, value]) => (
                                                        <MenuItem key={key} value={key}>{value}</MenuItem>
                                                    ))}
                                                </Select>
                                            </ListItem>
                                            <ListItem>
                                                <div style={{ display: 'flex' }}>
                                                    <span style={{ width: '150px', flexShrink: 0 }}> <strong>Tags:</strong></span>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <InputLabel>Select tags</InputLabel>
                                                        <Select
                                                            style={{ width: '150px' }}
                                                            onChange={(event) => {
                                                                const selectedTag = tags.find((tag: any) => tag._id === event.target.value);
                                                                setSelectTags([...selectTags, selectedTag]);
                                                            }}
                                                        >
                                                            <MenuItem disabled value="">
                                                                <em>Select tags</em>
                                                            </MenuItem>
                                                            {tags.filter((tag: any) => !selectTags.map(t => t._id).includes(tag._id)).map((tag: any) => (
                                                                <MenuItem key={tag._id} value={tag._id}>
                                                                    {tag.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                                            {selectTags.map((tag: any) => (
                                                                <Chip
                                                                    label={tag.name}
                                                                    onDelete={() => setSelectTags(selectTags.filter((t) => t._id !== tag._id))}
                                                                    key={tag._id}>
                                                                </Chip>
                                                            ))}
                                                        </Stack>
                                                    </div>
                                                </div>
                                            </ListItem>
                                            <ListItem>
                                                <div style={{ display: 'flex', width: '100%' }}>
                                                    <span style={{ width: '150px', flexShrink: 0 }}>
                                                        <strong>Image List:</strong>
                                                    </span>
                                                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                        {images.map((item: any, index: number) => (
                                                            <TextField
                                                                key={index}
                                                                multiline
                                                                fullWidth
                                                                style={{ width: '100%' }}
                                                                value={item}
                                                                id="image"
                                                                name="image"
                                                                type="text"
                                                                onChange={(e) => handleImageUrlChange(e.target.value, index)}
                                                            />
                                                        ))}
                                                        <Button onClick={handleAddImage}>+ Add New Image</Button>
                                                    </div>

                                                </div>
                                            </ListItem>

                                        </List>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                            <Button variant="contained" color="primary" onClick={handleUpdatePlace} >
                                                Update
                                            </Button>
                                            <Button variant="contained" color="error" onClick={async () => {
                                                await fetchData()
                                                setEdit(false)
                                            }}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardHeader title="Place Images" />
                                    <CardContent>
                                        <ImageList
                                            variant="quilted"
                                            cols={2}
                                            rowHeight={121}
                                        >
                                            {place['images'].map((item: any, index: number) => (
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
                        : <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <Card>
                                    <CardHeader title="Place Details" action={
                                        <Button variant="contained" color="primary" onClick={() => setEdit(true)}>
                                            Edit
                                        </Button>
                                    } />
                                    <CardContent>
                                        <List>
                                            <ListItem>
                                                <span style={{ width: '150px' }}> <strong>Place ID:</strong></span>
                                                {place['place_id']}
                                            </ListItem>
                                            <ListItem>
                                                <span style={{ width: '150px' }}> <strong>Name:</strong></span>
                                                {name}
                                            </ListItem>
                                            <ListItem>
                                                <span style={{ width: '150px' }}> <strong>City:</strong></span>
                                                {city}
                                            </ListItem>
                                            <ListItem>
                                                <div style={{ display: 'flex' }}>
                                                    <span style={{ width: '150px', flexShrink: 0 }}>
                                                        <strong>Address:</strong>
                                                    </span>

                                                    {place['address']}
                                                </div>
                                            </ListItem>
                                            <ListItem>
                                                <span style={{ width: '150px' }}> <strong>Phone:</strong></span>
                                                {place['phone']}
                                            </ListItem>

                                            <ListItem>
                                                <span style={{ width: '150px' }}> <strong>Long:</strong></span>
                                                {long}
                                            </ListItem>
                                            <ListItem>
                                                <span style={{ width: '150px' }}> <strong>Lat:</strong></span>
                                                {lat}
                                            </ListItem>
                                            <ListItem>
                                                <span style={{ width: '150px' }}> <strong>Province:</strong></span>
                                                {province}
                                            </ListItem>
                                            <ListItem>
                                                <div style={{ display: 'flex' }}>
                                                    <span style={{ width: '150px', flexShrink: 0 }}> <strong>Tags:</strong></span>

                                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                                        {selectTags.map((tag: any) => (
                                                            <Chip
                                                                label={tag.name}
                                                                key={tag._id}>
                                                            </Chip>
                                                        ))}
                                                    </Stack>
                                                </div>
                                            </ListItem>
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardHeader title="Place Images" />
                                    <CardContent>
                                        <ImageList
                                            variant="quilted"
                                            cols={2}
                                            rowHeight={121}
                                        >
                                            {place['images'].map((item: any, index: number) => (
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
                </>
            }

        </Container>
    );
};

export default Index;
