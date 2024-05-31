"use client";
import { VIETNAM_PROVINCES } from "@/hooks/regex";
import { Alert, Box, Button, Chip, CircularProgress, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
const AddPlacePage = () => {
  const router = useRouter()
  const [tags, setTags] = useState<any[]>([]);
  const [selectTags, setSelectTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState({
    name: "",
    place_id: "",
    type: "tourist_attraction",
    address: "",
    images: [""],
    website: "",
    phone: "",
    province: 'DA_NANG',
    city: "",
    geolocation: {
      type: "Point",
      coordinates: [],
    },
  });
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleAutoClose = () => {
    setOpen(false)
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `http://localhost:3056/api/v1/tag`
      )
      setTags(res.data['metadata'])
    }
    fetchData()
  }, [])
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;

    if (name === "coordinates") {
      setPlace({
        ...place,
        geolocation: {
          ...place.geolocation,
          coordinates: value.split(",").map(Number),
        },
      });
    } else if (name === "type") {
      setPlace({
        ...place,
        geolocation: { ...place.geolocation, type: value },
      });
    } else if (name === "images") {
      setPlace({ ...place, images: value.split(",") });
    } else {
      setPlace({ ...place, [name]: value });
    }
  };



  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setLoading(true);
    try {
      const tagIds = selectTags.map((item) => item._id)
      const tagNames = selectTags.map((item) => item.name)
      const response = await axios.post('http://localhost:3056/api/v1/place', place);
      const responsetag = await axios.post(`http://localhost:3056/api/v1/tag/place/${place.place_id}`, {
        "tags": tagIds
      });
      const responseML = await axios.post(`https://exotic-filly-publicly.ngrok-free.app/places`, {

        "id": place.place_id,
        "title": place.name,
        "tags": tagNames

      });
      // console.log(response.data)
      // console.log(responsetag.data)
      // console.log(responseML.data)
      // console.log(place)
      setOpen(true)
    } catch (err) {
      console.log(err)
    }
    setLoading(false);
    setTimeout(() => {
      router.push(`places`)
    }, 2000); // 2000 milliseconds = 2 seconds
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={6000} onClick={handleClose} onClose={handleAutoClose}>
        <Alert onClose={handleClose} severity="success">
          Success!
        </Alert>
      </Snackbar>
      {loading ? <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box> : (
        <form onSubmit={handleSubmit}>

          <FormControl fullWidth margin="normal">
            <TextField label="Name" name="name" value={place.name} onChange={handleInputChange} required />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField label="Place ID" name="place_id" value={place.place_id} onChange={handleInputChange} required />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select tags</InputLabel>
            <Select
              value=""
              onChange={(event) => {
                const selectedTag = tags.find((tag: any) => tag._id === event.target.value);
                setSelectTags([...selectTags, selectedTag]);
              }}
            >
              <MenuItem value="">
                <em>Select tags</em>
              </MenuItem>
              {tags.filter((tag: any) => !selectTags.map(t => t._id).includes(tag._id)).map((tag: any) => (
                <MenuItem key={tag._id} value={tag._id}>
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack direction="row" spacing={1}>
            {selectTags.map((tag: any) => (
              <Chip
                label={tag.name}
                onDelete={() => setSelectTags(selectTags.filter((t) => t._id !== tag._id))}
                key={tag._id}>
              </Chip>
            ))}
          </Stack>
          {/* ... other form controls ... */}
          <FormControl fullWidth margin="normal">
            <TextField label="Address" name="address" value={place.address} onChange={handleInputChange} required />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField label="Website" name="website" value={place.website} onChange={handleInputChange} />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField label="Phone" name="phone" value={place.phone} onChange={handleInputChange} />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Province</InputLabel>
            <Select
              name="province"
              value={place.province}
              onChange={handleInputChange}
              required
            >
              {Object.entries(VIETNAM_PROVINCES).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField label="City" name="city" value={place.city} onChange={handleInputChange} />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField label="Coordinates" name="coordinates" placeholder="Enter comma-separated values" onChange={handleInputChange} required />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField multiline label="Image Links" name="images" onChange={handleInputChange} placeholder="Enter image links separated by commas" />
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            Add Place
          </Button>
        </form>
      )}
    </div>

  );
};

export default AddPlacePage;
