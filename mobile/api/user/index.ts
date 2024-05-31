import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFriendAndFollower = (userId: string | undefined, token: string | undefined) => {
    const queryFn = async () => {
        try {
            const { data } = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API}/user/follow/${userId}`,
                {
                    headers: {
                        "x-client-id": userId,
                        "authorization": token,
                        "Content-Type": "application/json",
                    },
                })

            const res = data['metadata']['attributes']['friend']
            return res;
        } catch (err) {
            console.log(err)
            return undefined
        }
    }
    return useQuery({
        queryKey: ['friends-followers'],
        queryFn
    });
}

export const useFriends = (userId: string | undefined) => {
    const queryFn = async () => {
        try {
            const { data } = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API}/friend/${userId}`,
                {
                    headers: {
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
        queryKey: ['friends-list'],
        queryFn
    });
}

export const useFriendRequest = (userId: string | undefined) => {
    const queryFn = async () => {
        try {
            const { data } = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API}/friend/request/${userId}`,
                {
                    headers: {
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
        queryKey: ['friends-request-list'],
        queryFn
    });
}

export const useFriendRequested = (userId: string, token: string) => {
    const queryFn = async () => {
        try {
            const { data } = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_API}/friend/requested`,
                {}, {
                headers: {
                    "Content-Type": "application/json",
                    "x-client-id": userId,
                    "authorization": token,
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
        queryKey: ['friends-requested-list'],
        queryFn
    });
}

export const useNonFriends = (userId: string | undefined) => {
    const queryFn = async () => {
        try {
            const { data } = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API}/friend/nonfriend/${userId}`,
                {
                    headers: {
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
        queryKey: ['nonfriends-list'],
        queryFn
    });
}

export const useNotifications = (userId: string | undefined) => {
    const queryFn = async () => {
        try {
            const { data } = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API}/notification/${userId}`,
                {
                    headers: {
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
        queryKey: ['notification', userId],
        queryFn
    });
}

export const useOtherUserProfile = (
    targetUserId: string | undefined,) => {
    const queryFn = async () => {
        try {
            const { data } = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API}/user/${targetUserId}`,
                {
                    headers: {
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
        queryKey: ['other-user-id', targetUserId],
        queryFn
    });
}

export const updateProfile = async (userId: string, token: string, avatarUrl: string, firstName?: string, lastName?: string) => {
    try {
        const res = await axios.patch(`${process.env.EXPO_PUBLIC_BACKEND_API}/user/update`,
            {
                avatarUrl: avatarUrl,
                firstName: firstName,
                lastName: lastName,
            },
            {
                headers: {
                    "x-client-id": userId,
                    "authorization": token,
                    "Content-Type": "application/json",
                },
            })
        return res.data
    } catch (err) {
        console.log(err)
        return undefined
    }
}

export const removeFriend = async (userId: string, token: string, friendId: string) => {
    try {
        const res = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_API}/friend/remove`,
            { targetId: friendId },
            {
                headers: {
                    "x-client-id": userId,
                    "authorization": token,
                    "Content-Type": "application/json",
                },
            })
        console.log(res.data);

        return res.data
    } catch (err) {
        console.log(err)
        return undefined
    }
}