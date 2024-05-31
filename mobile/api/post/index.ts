import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export const createPost = async (userId: string, token: string, content: string, images: string[]) => {

    try {
        const { data } = await axios.post(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/post`,
            {
                content: content,
                images: images,
            },
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
        console.log(error);
    }
}

export const getPostDetail = async (userId: string, token: string, postId: string) => {
    try {
        const { data } = await axios.get(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/post/${postId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token,
                    "x-client-id": userId,
                }
            }
        )
        return data["metadata"]
    } catch (error) {
        console.log(error);
    }
}

export const useAllPosts = () => {

    const queryFn = async ({ pageParam = 1 }) => {
        const limit = 20;
        const { data } = await axios.get(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/post?limit=${limit}&page=${pageParam}`,
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
        queryKey: [`post`],
        queryFn,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length === 0) return undefined
            return allPages.length + 1
        }
    });
};

export const useAllUserPosts = (token: string, userId: string) => {

    const queryFn = async ({ pageParam = 1 }) => {
        const limit = 20;
        const { data } = await axios.get(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/post/user?limit=${limit}&page=${pageParam}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token,
                    "x-client-id": userId,
                }
            }
        );

        const res = data['metadata']

        return res;
    };
    return useInfiniteQuery({
        queryKey: [`post`, userId],
        queryFn,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length === 0) return undefined
            return allPages.length + 1
        }
    });
};

export const likePost = async (userId: string, token: string, postId: string, type: string) => {
    try {
        const { data } = await axios.post(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/post/like/${postId}`,
            {
                type: type
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token,
                    "x-client-id": userId,
                }
            }
        )
        return data["metadata"]
    } catch (error) {
        console.log(error);
    }
}

export const updatePost = async (userId: string, token: string, postId: string, content: string, images: string[]) => {
    try {
        const { data } = await axios.patch(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/post/${postId}`,
            {
                content: content,
                images: images
            },
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
        console.log(error);
    }
}

export const deletePost = async (userId: string, token: string, postId: string) => {
    try {
        const { data } = await axios.delete(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/post/${postId}`,
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
        console.log(error);
    }
}