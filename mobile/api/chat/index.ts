import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useAllGroupChat = (userId: string | undefined, token: string | undefined) => {
    const queryFn = async () => {
        try {
            const { data } = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API}/groupchat`,
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
        queryKey: ['all-groupchats'],
        queryFn
    });
}

const useAllMessages = (groupChatId: string | undefined) => {
    const queryFn = async () => {
        try {
            const { data } = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API}/message/${groupChatId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

            const res = data['metadata'].reverse()
            return res;
        } catch (err) {
            console.log(err)
            return undefined
        }
    }
    return useQuery({
        queryKey: ['all-messages', groupChatId],
        queryFn
    });
}

const useAllParticipants = (groupId: string | undefined) => {
    const queryFn = async () => {
        try {
            const { data } = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_API}/groupchat/${groupId}`,
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
        queryKey: ['room-participants', groupId],
        queryFn
    });
}

export { useAllGroupChat, useAllMessages, useAllParticipants }