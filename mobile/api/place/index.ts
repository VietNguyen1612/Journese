import { QueryCache, useInfiniteQuery, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Coordinates } from "@mapbox/mapbox-sdk/lib/classes/mapi-request";
const placesData = [
    {
        place_id: "1",
        name: "Quảng trường Lâm Viên",
        score: 5,
        geolocation: {
            type: 'Point',
            coordinates: [
                106.66482,
                10.786656
            ]
        },
        address: "Nhân Văn Bookstore, 875 CMT8 St., Ward 15, Dist. 10, Ho Chi Minh City, 740900, Vietnam",
        images: ["https://mia.vn/media/uploads/blog-du-lich/quang-truong-lam-vien-bieu-tuong-cua-thanh-pho-da-lat-tho-mong-06-1634561346.jpeg"],
    },
    {
        place_id: "2",
        name: "Thác Datanla",
        score: 5,
        geolocation: {
            type: 'Point',
            coordinates: [
                106.66482,
                10.786656
            ]
        },
        address: "Nhân Văn Bookstore, 875 CMT8 St., Ward 15, Dist. 10, Ho Chi Minh City, 740900, Vietnam",
        images: ["https://mia.vn/media/uploads/blog-du-lich/quang-truong-lam-vien-bieu-tuong-cua-thanh-pho-da-lat-tho-mong-06-1634561346.jpeg"],
    },
    {
        place_id: "3",
        name: "Khu vui chơi giải trí Thỏ Trắng",
        score: 5,
        geolocation: {
            type: 'Point',
            coordinates: [
                106.66482,
                10.786656
            ]
        },
        address: "Nhân Văn Bookstore, 875 CMT8 St., Ward 15, Dist. 10, Ho Chi Minh City, 740900, Vietnam",
        images: ["https://mia.vn/media/uploads/blog-du-lich/quang-truong-lam-vien-bieu-tuong-cua-thanh-pho-da-lat-tho-mong-06-1634561346.jpeg"],
    },
    {
        place_id: "4",
        name: "Khu vui chơi giải trí Thỏ Trắng",
        score: 5,
        geolocation: {
            type: 'Point',
            coordinates: [
                106.66482,
                10.786656
            ]
        },
        address: "Nhân Văn Bookstore, 875 CMT8 St., Ward 15, Dist. 10, Ho Chi Minh City, 740900, Vietnam",
        images: ["https://mia.vn/media/uploads/blog-du-lich/quang-truong-lam-vien-bieu-tuong-cua-thanh-pho-da-lat-tho-mong-06-1634561346.jpeg"],
    },
    {
        place_id: "5",
        name: "Khu vui chơi giải trí Thỏ Trắng",
        score: 5,
        geolocation: {
            type: 'Point',
            coordinates: [
                106.66482,
                10.786656
            ]
        },
        address: "Nhân Văn Bookstore, 875 CMT8 St., Ward 15, Dist. 10, Ho Chi Minh City, 740900, Vietnam",
        images: ["https://mia.vn/media/uploads/blog-du-lich/quang-truong-lam-vien-bieu-tuong-cua-thanh-pho-da-lat-tho-mong-06-1634561346.jpeg"],
    },
    {
        place_id: "6",
        name: "Khu vui chơi giải trí Thỏ Trắng",
        score: 5,
        geolocation: {
            type: 'Point',
            coordinates: [
                106.66482,
                10.786656
            ]
        },
        address: "Nhân Văn Bookstore, 875 CMT8 St., Ward 15, Dist. 10, Ho Chi Minh City, 740900, Vietnam",
        images: ["https://mia.vn/media/uploads/blog-du-lich/quang-truong-lam-vien-bieu-tuong-cua-thanh-pho-da-lat-tho-mong-06-1634561346.jpeg"],
    },
    {
        place_id: "7",
        name: "Khu vui chơi giải trí Thỏ Trắng",
        score: 5,
        geolocation: {
            type: 'Point',
            coordinates: [
                106.66482,
                10.786656
            ]
        },
        address: "Nhân Văn Bookstore, 875 CMT8 St., Ward 15, Dist. 10, Ho Chi Minh City, 740900, Vietnam",
        images: ["https://mia.vn/media/uploads/blog-du-lich/quang-truong-lam-vien-bieu-tuong-cua-thanh-pho-da-lat-tho-mong-06-1634561346.jpeg"],
    },
    {
        place_id: "8",
        name: "Khu vui chơi giải trí Thỏ Trắng aa a a ",
        score: 5,
        geolocation: {
            type: 'Point',
            coordinates: [
                106.66482,
                10.786656
            ]
        },
        address: "Nhân Văn Bookstore, 875 CMT8 St., Ward 15, Dist. 10, Ho Chi Minh City, 740900, Vietnam",
        images: ["https://mia.vn/media/uploads/blog-du-lich/quang-truong-lam-vien-bieu-tuong-cua-thanh-pho-da-lat-tho-mong-06-1634561346.jpeg"],
    },


]
const useNearByPlaces = (token: string) => {
    const queryFn = async () => {
        try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API}/place/search/670000`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
            const json = response.data
            const places = json['metadata']
            return places
        } catch (err) {
            return placesData
        }

    }
    return useQuery({
        queryKey: ['places'],
        queryFn
    })
}

const useExplorePLaces = (id: string | undefined, keySearch: string, tags: Array<{ _id: string, name: string }>, limit?: number) => {
    let tagIDs = tags.map(item => item._id);
    const queryFn = async () => {
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_API}/place/page`,
                {
                    "userId": id,
                    "keySearch": keySearch,
                    "tags": tagIDs,
                    limit: limit
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            const json = response.data
            const places = json['metadata']
            return places
        } catch (err) {

        }
    }
    return useQuery({
        queryKey: ['explore-places', keySearch, tagIDs],
        queryFn
    })
}

const useProvincePLaces = (province: string, limit: number) => {
    const queryFn = async ({ pageParam = 1 }) => {
        try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API}/place/provinces/${province}?limit=${limit}&page=${pageParam}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            const json = response.data
            const places = json['metadata']['places']
            return places
        } catch (err) {
            console.error(err)
        }
    }
    return useInfiniteQuery({
        queryKey: ['province-places', province],
        queryFn,
        getNextPageParam: (lastPage, allPages) => {
            // console.log('lastpage', lastPage.length)
            // console.log('allpage', allPages.length)
            if (!lastPage || lastPage.length === 0) return undefined
            return allPages.length + 1
        }
    })
}

const usePlaceDetail = (place_id: string) => {
    const queryFn = async () => {
        try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API}/place/get-place/${place_id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            const json = response.data
            const placeDetail = json['metadata']
            return placeDetail
        } catch (err) {
            return undefined
        }
    }
    return useQuery({
        queryKey: ['place-detail', place_id],
        queryFn
    })
}

const useAllTag = () => {
    const queryFn = async () => {
        try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API}/tag`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            const json = response.data
            const tagList = json['metadata']
            return tagList
        } catch (err) {
            return undefined
        }
    }
    return useQuery({
        queryKey: ['tag-list'],
        queryFn
    })
}

const usePlaceByTag = (tags: Array<{ _id: string, name: string }>) => {
    let tagIDs = tags.map(item => item._id);
    const queryFn = async () => {
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_API}/tag/places`,
                {
                    "tags": tagIDs
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
            const json = response.data
            const result = json['metadata']
            return result
        } catch (err) {
            console.log(err)
        }
    }
    return useQuery(['list-place-by-tag', tagIDs], queryFn, { enabled: true })
}

const useRatingByPlaceId = (place_id: string) => {
    const queryFn = async () => {
        try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API}/rating/${place_id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            const json = response.data
            const ratingList = json['metadata']
            return ratingList
        } catch (err) {
            return undefined
        }
    }
    return useQuery({
        queryKey: ['rating-list-by-placeid', place_id],
        queryFn
    })
}
const getNearbyPlaces = (position: Coordinates | undefined,
    radius = 10000,
    limit = 50) => {

    const queryFn = async () => {
        try {
            let access_token = `pk.eyJ1IjoidmlldG5ndXllbjEyMyIsImEiOiJjbG93eW9rYjEwYm53MmtwaWFlY2V6NjI0In0.Wt4Nz7TbLXPj01uoH2nTJQ`;
            const response = await axios.get(
                `https://api.mapbox.com/v4/vietnguyen123.738j03pn/tilequery/${position?.[0]},${position?.[1]}.json?radius=${radius}&limit=${limit}&dedupe=&access_token=${access_token}`,

                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            return response.data['features']
        } catch (err) {
            console.error('getapinearby', err)
        }
    }
    return useQuery({
        queryKey: ['near-by-places', position],
        queryFn
    })
}

export const ratingPlaces = async (token: string, userId: string, favorites: Array<{ placeId: string, rating: number }>) => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_API}/userfavorite`,
            {
                ratings: favorites
            },
            {
                headers: {
                    "Authorization": token,
                    "x-client-id": userId,
                    "Content-Type": "application/json",
                },
            })
        console.log(response.data);

        return response.data
    } catch (err) {
        console.error(err)
    }
}

export { useNearByPlaces, useExplorePLaces, useProvincePLaces, usePlaceDetail, useAllTag, usePlaceByTag, useRatingByPlaceId, getNearbyPlaces }