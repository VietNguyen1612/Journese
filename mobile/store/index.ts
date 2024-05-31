import { create } from 'zustand'
import { io, Socket } from 'socket.io-client';
import { Place } from '../app/(general)/trip-detail';
//phần này là cho auth. User là user đc trả khi gọi api sign-in

export type AuthUser = {
    _id: string;
    phone: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    isValid: boolean;
}

type AuthToken = {
    accessToken: string;
    refreshToken: string;
}

export type AuthPayload = {
    user: AuthUser;
    tokens: AuthToken
}

interface AuthStore {
    authPayload: AuthPayload | null
    setAuthPayload: (authPayload: AuthPayload | null) => void
    setAuthAvatar: (avatarUrl: string) => void
    setAuthName: (firstName: string, lastName: string) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    authPayload: null,
    // authPayload: {
    //     user: {
    //         _id: "65bbb8839ea0eb2d4daec5e7",
    //         phone: "1",
    //         firstName: "string",
    //         lastName: "string",
    //         avatarUrl: "",
    //         isVerify: true,
    //     },
    //     tokens: {
    //         accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWJiYjg4MzllYTBlYjJkNGRhZWM1ZTciLCJwaG9uZSI6IjAzOTk3MTYzNDMiLCJyb2xlIjoidXNlciIsImlhdCI6MTcxMTQ2NTMyMywiZXhwIjoxNzEyMDcwMTIzfQ.djqfpNJWzvtgmlKHkFkNwA_qNeXLeh3gQgNEDms4dBg",
    //         refreshToken: "string",
    //     }
    // },
    setAuthPayload: (authPayload) => set((state) => ({ ...state, authPayload: authPayload })),
    setAuthAvatar: (avatarUrl) => set((state) => {
        let newAuthPayload = state.authPayload
        if (newAuthPayload) {
            newAuthPayload.user.avatarUrl = avatarUrl
        }
        return { ...state, authPayload: newAuthPayload }
    }),
    setAuthName: (firstName, lastName) => set((state) => {
        let newAuthPayload = state.authPayload
        if (newAuthPayload) {
            newAuthPayload.user.firstName = firstName
            newAuthPayload.user.lastName = lastName
        }
        return { ...state, authPayload: newAuthPayload }
    })
}))

interface InterestStore {
    interest: string[] | null
    setInterest: (interst: string[] | null) => void
}

export const useInterestStore = create<InterestStore>((set) => ({
    interest: null,
    setInterest: (interest) => set((state) => ({ ...state, interest: interest }))
}))

type NavigatingPlace = {
    place_id: string,
    name: string,
    address: string,
    geolocation: {
        type: string,
        coordinates: [number, number]
    }
}

interface NavPlaceStore {
    navPlace: NavigatingPlace | null;
    setNavPlace: (navPlace: NavigatingPlace | null) => void
}

export const useNavPlaceStore = create<NavPlaceStore>((set) => ({
    //navPlace: null,
    navPlace: {
        place_id: "ChIJuZxn7NAScTERQB4WFRsQ3Wk",
        name: "Là Việt Coffee",
        address: "200 Nguyễn Công Trứ, Phường 8, Thành phố Đà Lạt, Lâm Đồng 66000, Việt Nam",
        geolocation: {
            type: "Point",
            coordinates: [108.43509209999999, 11.956792499999999]
        }
    },
    setNavPlace: (navPlace) => set(() => ({ navPlace: navPlace }))
}))

interface SocketStore {
    socket: Socket | null
    setSocket: (socket: Socket | null) => void
}

export const useSocketStore = create<SocketStore>((set) => ({
    socket: null,
    setSocket: (socket: Socket | null) => set({ socket }),
}));

type RatingTripDetail = {
    tripId: string,
    name: string,
    places: [Place]
}

interface RatingTripDetailStore {
    ratingTripDetail: RatingTripDetail | null,
    setRatingTripDetail: (ratingTripDetail: RatingTripDetail | null) => void
}

export const useRatingTripDetailStore = create<RatingTripDetailStore>((set) => ({
    ratingTripDetail: null,
    setRatingTripDetail: (ratingTripDetail) => set(() => ({ ratingTripDetail: ratingTripDetail }))
}))

interface ExpoNotificationStore {
    expoToken: string | null,
    setExpoToken: (expoToken: string | null) => void
}

export const useExpoNotificationStore = create<ExpoNotificationStore>((set) => ({
    expoToken: null,
    setExpoToken: (expoToken) => set(() => ({ expoToken: expoToken }))
}))