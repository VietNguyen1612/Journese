import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import axios from 'axios';
import Mapbox from '@rnmapbox/maps';
import { Coordinates } from '@mapbox/mapbox-sdk/lib/classes/mapi-request';
let access_token = `pk.eyJ1IjoidmlldG5ndXllbjEyMyIsImEiOiJjbG93eW9rYjEwYm53MmtwaWFlY2V6NjI0In0.Wt4Nz7TbLXPj01uoH2nTJQ`
Mapbox.setAccessToken(access_token)


const useUserLocation = () => {
    const [location, setLocation] = useState<Coordinates | undefined>();
    const [userCurrentAddress, setUserCurrentAddress] = useState()
    const [ref, setRef] = useState(false)

    const refetch = () => {
        setRef(pre => !pre)
    }

    useEffect(() => {
        const fetchUserLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission to access location was denied");
                return;
            }

            try {
                let locationResponse = await Location.getLastKnownPositionAsync({});
                if (locationResponse != null) {
                    setLocation([
                        locationResponse.coords.longitude,
                        locationResponse.coords.latitude,
                    ]);
                    const res = await axios.get(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationResponse.coords.longitude},${locationResponse.coords.latitude}.json?limit=1&access_token=${access_token}`
                    );
                    setUserCurrentAddress(res.data.features[0].place_name);
                }
            } catch (error: any) {
                console.log(error.message);
            }
        };

        fetchUserLocation();

    }, [ref]);

    return { location, userCurrentAddress, refetch };
};
const useTrackUserLocation = () => {
    const [trackLocation, setTrackLocation] = useState<Coordinates | undefined>();
    const [userCurrentAddress, setUserCurrentAddress] = useState()

    useEffect(() => {
        const fetchUserLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission to access location was denied");
                return;
            }

            try {
                await Location.watchPositionAsync({
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 1000,
                    // distanceInterval: 0,  
                },
                    (loc) => { setTrackLocation([loc.coords.longitude, loc.coords.latitude]) });
            } catch (error: any) {
                console.log(error.message);
            }
        };

        fetchUserLocation();

    }, []);

    return { trackLocation };
};

export { useUserLocation, useTrackUserLocation };
