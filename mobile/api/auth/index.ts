import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthPayload } from "../../store";

export interface SigninRequest {
    phone: string,
    password: string,
    expoToken: string | null
}

export interface SigninResponse {
    message: string,
    statusCode: number,
    metadata: AuthPayload
}

export interface SignupRequest {
    firstName: string,
    lastName: string,
    phone: string,
    password: string,
    code: string,
}

export interface SignupResponse {
    message: string,
    statusCode: number,
    metadata: {
        user: {
            _id: string,
            phone: string,
            firstName: string,
            lastName: string,
            avatarUrl: string
        },
        tokens: {
            accessToken: string,
            refreshToken: string
        }
    }
}


export const signin = async (signinRequest: SigninRequest) => {
    try {
        const { phone, password, expoToken } = signinRequest

        const { data } = await axios.post<SigninResponse>(
            `${process.env.EXPO_PUBLIC_BACKEND_API}/auth/user/signin`,
            {
                phone: phone,
                password: password,
                expoToken: expoToken
            },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )
        return data
    } catch (error) {

    }
}

export const signup = async (signupRequest: SignupRequest) => {
    try {
        const { phone, password, firstName, lastName, code } = signupRequest
        const { data } = await axios.post<SigninResponse>(
            //để localhost ko chạy. Bên android phải thay localhost = ipv4 address
            `${process.env.EXPO_PUBLIC_BACKEND_API}/auth/user/signup`,
            {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                password: password,
                code: code
            },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )
        return data
    } catch (error) {

    }
}

export const sendOTP = async (phone: string) => {
    try {
        const { data } = await axios.post(
            //để localhost ko chạy. Bên android phải thay localhost = ipv4 address
            `${process.env.EXPO_PUBLIC_BACKEND_API}/auth/user/sendOTP`,
            {
                phone: phone
            },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )
        // console.log(data);

        return data
    } catch (error) {
        return {
            statusCode: 403
        }

    }
}

