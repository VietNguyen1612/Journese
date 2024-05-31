import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useAllUserAds = (
    token: string | undefined,
    userId: string | undefined,
    isPaid: boolean,
    isExpired: boolean,
    isValid: boolean
) => {
    const queryFn = async () => {

        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_API}/ads`,
                {
                    "isValid": isValid,
                    "isPaid": isPaid,
                    "isExpired": isExpired
                },
                {
                    headers: {
                        "x-client-id": `${userId}`,
                        "authorization": `${token}`,
                        "Content-Type": "application/json",
                    }
                })
            const json = response.data
            const adsArr = json['metadata']
            return adsArr
        } catch (err) {
            // console.log(err)
            return undefined
        }
    }
    return useQuery({
        queryKey: ['all-user-ads', userId],
        queryFn
    });
}

export const useAllAds = (
) => {
    const queryFn = async () => {

        try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API}/ads?isValid=true&isPaid=true&isExpired=false`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
            const json = response.data
            const adsArr = json['metadata']
            return adsArr.map((ad: any) => ad.image)
        } catch (err) {
            // console.log(err)
            return undefined
        }
    }
    return useQuery({
        queryKey: ['all-ads'],
        queryFn
    });
}
