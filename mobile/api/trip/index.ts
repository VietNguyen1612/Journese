import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthUser, useAuthStore } from "../../store";
import { Place, Trip } from "../../app/(general)/trip-detail";

export interface CreateTripRequest {
    token: string | undefined,
    userID: string | undefined
    title: string,
    places?: Array<string>,
    isPublish: boolean,
    participates?: Array<string>
}

export interface CreateTripResponse {
    message: string,
    statusCode: number,
}

export const createTripAPI = async (createTripRequest: CreateTripRequest) => {
    try {
        let { title, places, token, userID, isPublish, participates } = createTripRequest
        if (!places) places = []

        const { data } = await axios.post<CreateTripResponse>(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/trip`,
            {
                title: title,
                places: places,
                isPublish: isPublish,
                participates: participates
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token,
                    "x-client-id": userID,
                }
            }
        )
        return data
    } catch (error) {

    }
}

export const useAllTripByUserId = (token: string, userId: string, status: string[] | string) => {

    const queryFn = async ({ pageParam = 1 }) => {
        let list_status
        if (typeof status === "string") list_status = [status]
        else list_status = [...status]

        if (status === "ALL") { list_status = ["DRAFT", "IN-COMING", "ON-GOING", "FINISHED"] }
        const { data } = await axios.post(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/trip/user`,
            { userId: userId, status: list_status },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                    "x-client-id": userId,
                }
            }
        );
        const res = data['metadata']

        return res;
    };
    return useQuery({
        queryKey: [`user-trip`, status],
        queryFn,
        // getNextPageParam: (lastPage, allPages) => {
        //     if (lastPage.length === 0) return undefined
        //     return allPages.length + 1
        // }
    });
};

// export const useUserTripByStatus = (token: string, userId: string, status: string) => {

//     const queryFn = async ({ pageParam = 1 }) => {
//         const { data } = await axios.get(
//             `${process.env.EXPO_PUBLIC_BACKEND_API}/trip/status/${status}`,
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": token,
//                     "x-client-id": userId,
//                 }
//             }
//         );
//         const res = data['metadata']

//         return res;
//     };
//     return useQuery({
//         queryKey: [`${status}-trip`],
//         queryFn,
//         // getNextPageParam: (lastPage, allPages) => {
//         //     if (lastPage.length === 0) return undefined
//         //     return allPages.length + 1
//         // }
//     });
// };

export const useRecommendationTripByStatus = (token: string, userId: string, status: string) => {

    const queryFn = async ({ pageParam = 1 }) => {
        const limit = 20
        const { data } = await axios.post(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/trip/status?limit=${limit}&page=${pageParam}`,
            {
                status: status,
                userId: userId
            },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );

        const res = data['metadata']

        return res;
    };
    return useInfiniteQuery({
        queryKey: [`trip`, status],
        queryFn,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length === 0) return undefined
            return allPages.length + 1
        }
    });
};

export const getTripDetail = async (tripId: string, userId?: string) => {

    try {
        let userParams = ""
        if (userId) {
            userParams = `?userId=${userId}`
        }
        const { data } = await axios.get(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/trip/${tripId}${userParams}`,
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )
        return data
    } catch (error) {

    }
};

type updateTripRequest = {
    title?: string,
    places?: Array<string>,
    isPublish?: boolean,
    participates?: Array<string>,
    status?: string,
    startDate?: Date | null,
    endDate?: Date | null,
    onGoingParticipates?: Array<string>
}

export const updateTrip = async (tripId: string, userId: string, token: string, req: updateTripRequest) => {

    try {
        const { data } = await axios.patch(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/trip/${tripId}`,
            req,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                    "x-client-id": userId,
                }
            }
        )
        return data
    } catch (error) {

    }
};

export const joinTrip = async (tripId: string, userId: string, token: string, onGoingParticipates: string[], status: string) => {

    try {
        const { data } = await axios.patch(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/trip/start/${tripId}`,
            {
                onGoingParticipates,
                status,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                    "x-client-id": userId,
                }
            }
        )
        return data
    } catch (error) {

    }
};

export const scheduleTrip = async (tripId: string, userId: string, token: string, req: updateTripRequest) => {

    try {
        const { data } = await axios.post(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/trip/schedule/${tripId}`,
            req,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                    "x-client-id": userId,
                }
            }
        )
        return data
    } catch (error) {

    }
};

const useOngoingTrip = (userId: string | undefined, token: string | undefined) => {
    const queryFn = async () => {
        try {
            const { data } = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_API}/trip/user`,
                { userId: userId, status: ["ON-GOING"] },
                {
                    headers: {
                        "x-client-id": userId,
                        "authorization": token,
                        "Content-Type": "application/json",
                    },
                })
            const res = data['metadata']
            return res;
        } catch (err) {
            console.log(err)
            return undefined
        }
    }
    return useQuery({
        queryKey: ['ongoing-trip-places'],
        queryFn
    });
}

const useAllTrip = (userId: string | undefined, token: string | undefined, statusArr: Array<string>) => {
    const queryFn = async () => {
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_API}/trip/user`,
                {
                    "userId": userId,
                    "status": statusArr
                },
                {
                    headers: {
                        "x-client-id": `${userId}`,
                        "authorization": `${token}`,
                        "Content-Type": "application/json",
                    }
                })
            const json = response.data
            const tripArr = json['metadata']
            return tripArr
        } catch (err) {
            console.log(err)
            return undefined
        }
    }
    return useQuery({
        queryKey: ['all-trip'],
        queryFn
    });
}

const addPlaceToTrip = async (userId: string, token: string, placeId: string, tripArr: Array<string>) => {
    let json
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_API}/place/add-to-trips`,

            {
                "place": placeId,
                "trips": tripArr
            }
            ,
            {
                headers: {
                    "x-client-id": `${userId}`,
                    "authorization": `${token}`,
                    "Content-Type": "application/json",
                }
            })
        json = response.data
        // console.log(json)
    } catch (err) {
        console.log(err)
    }
    return json
}

export const requestJoinTrip = async (token: string, userId: string, tripId: string) => {
    try {

        const { data } = await axios.post(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/trip/request/${tripId}`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token,
                    "x-client-id": userId,
                }
            }
        )
        return data
    } catch (error) {

    }
}

export const cancelRequestJoinTrip = async (token: string, userId: string, tripId: string) => {
    try {

        const { data } = await axios.post(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/trip/cancel-request/${tripId}`,
            { participateId: userId },
            {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token,
                    "x-client-id": userId,
                }
            }
        )
        return data
    } catch (error) {

    }
}

export const rejectParticipateToTrip = async (token: string, userId: string, participateId: string, tripId: string) => {
    try {

        const { data } = await axios.post(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/trip/request/reject/${tripId}`,
            { participateId: participateId },
            {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token,
                    "x-client-id": userId,
                }
            }
        )
        return data
    } catch (error) {

    }
}

export const acceptParticipateToTrip = async (token: string, userId: string, participateId: string, tripId: string) => {
    try {

        const { data } = await axios.post(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/trip/request/accept/${tripId}`,
            { participateId: participateId },
            {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token,
                    "x-client-id": userId,
                }
            }
        )
        return data
    } catch (error) {

    }
}


export const useAllRequestJoinTripSended = (token: string, userId: string) => {

    const queryFn = async ({ pageParam = 1 }) => {
        const { data } = await axios.post(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/trip/request-sended`, {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                    "x-client-id": userId,
                }
            }
        );
        const res = data['metadata']

        return res;
    };
    return useQuery({
        queryKey: [`request-sended`],
        queryFn,
        // getNextPageParam: (lastPage, allPages) => {
        //     if (lastPage.length === 0) return undefined
        //     return allPages.length + 1
        // }
    });
};

export const useRequestJoinTripReceive = (token: string, userId: string, tripId: string) => {

    const queryFn = async ({ pageParam = 1 }) => {
        const { data } = await axios.get(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/trip/request/${tripId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                    "x-client-id": userId,
                }
            }
        );
        const res = data['metadata']

        return res;
    };
    return useQuery({
        queryKey: [`request-join-trip`, tripId],
        queryFn,
        // getNextPageParam: (lastPage, allPages) => {
        //     if (lastPage.length === 0) return undefined
        //     return allPages.length + 1
        // }
    });
};

export const leaveTrip = async (token: string, userId: string, tripId: string) => {
    try {
        const { data } = await axios.post(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/trip/leave/${tripId}`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token,
                    "x-client-id": userId,
                }
            }
        )
        return data
    } catch (error) {

    }
}



export { useOngoingTrip, useAllTrip, addPlaceToTrip }
