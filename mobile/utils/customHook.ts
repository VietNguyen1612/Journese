import { useEffect, useState } from "react";
import { Place } from "../app/(general)/trip-detail";
import { Coordinates } from "@mapbox/mapbox-sdk/lib/classes/mapi-request";

const VIETNAM_PROVINCES = {
    AN_GIANG: "An Giang",
    BAC_GIANG: "Bắc Giang",
    BAC_KAN: "Bắc Kạn",
    BAC_LIEU: "Bạc Liêu",
    BAC_NINH: "Bắc Ninh",
    BEN_TRE: "Bến Tre",
    CAO_BANG: "Cao Bằng",
    DAK_LAK: "Đắk Lắk",
    DAK_NON: "Đắk Nông",
    DIEN_BIEN: "Điện Biên",
    DONG_NAI: "Đồng Nai",
    HA_GIANG: "Hà Giang",
    HAI_DUONG: "Hải Dương",
    HAI_PHONG: "Hải Phòng",
    HA_NAM: "Hà Nam",
    HA_NOI: "Hà Nội",
    HA_TINH: "Hà Tĩnh",
    HOA_BINH: "Hòa Bình",
    HUYEN_THAI: "Huyện Thái",
    LAO_CAI: "Lào Cai",
    LANG_SON: "Lạng Sơn",
    NAM_DINH: "Nam Định",
    NINH_BINH: "Ninh Bình",
    PHU_THO: "Phú Thọ",
    PHU_YEN: "Phú Yên",
    QUANG_BINH: "Quảng Bình",
    QUANG_NINH: "Quảng Ninh",
    SON_LA: "Sơn La",
    THAI_BINH: "Thái Bình",
    THAI_NGUYEN: "Thái Nguyên",
    THANH_HOA: "Thanh Hóa",
    TUYEN_QUANG: "Tuyên Quang",
    YEN_BAI: "Yên Bái",

    BINH_DINH: "Bình Định",
    BINH_DUONG: "Bình Dương",
    BINH_THUAN: "Bình Thuận",
    DA_NANG: "Đà Nẵng",
    GIA_LAI: "Gia Lai",
    KHANH_HOA: "Khánh Hòa",
    NINH_THUAN: "Ninh Thuận",
    QUANG_NGAI: "Quảng Ngãi",
    QUANG_TRI: "Quảng Trị",
    THUA_THIEN_HUE: "Thừa Thiên Huế",

    AG_GIA_RAI: "AG Gia Lai",
    BA_RIA_VUNG_TAU: "Bà Rịa Vũng Tàu",
    BAC_THU: "Bắc Thu",
    CA_MAU: "Cà Mau",
    CAN_THO: "Cần Thơ",
    DAU_TIENG: "Dầu Tiếng",
    DONG_THAP: "Đồng Tháp",
    HO_CHI_MINH: "Hồ Chí Minh",
    KIEN_GIANG: "Kiên Giang",
    LONG_AN: "Long An",
    QUANG_NAM: "Quảng Nam",
    QUANG_NGUYEN: "Quảng Ngãi",
    SOC_TRANG: "Sóc Trăng",
    TAY_NINH: "Tây Ninh",
    TIEN_GIANG: "Tiền Giang",
    VINH_LONG: "Vĩnh Long",
    VUNG_TAU: "Vũng Tàu",
    LAM_DONG: "Lâm Đồng",
};


type ProvinceKey = keyof typeof VIETNAM_PROVINCES;

const useProvinceName = (provinceName: string): string | null => {
    //const provinceKey = Object.keys(VIETNAM_PROVINCES).find(key => VIETNAM_PROVINCES[key as ProvinceKey] === provinceName);
    // if (provinceKey) {
    //     console.log(VIETNAM_PROVINCES[provinceKey as ProvinceKey])
    //     return VIETNAM_PROVINCES[provinceKey as ProvinceKey];
    // } else {
    //     return null;
    // }
    return VIETNAM_PROVINCES[provinceName as ProvinceKey];
}

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

const calculateCenter = (places: Array<Place>) => {
    let totalLongitude = 0;
    let totalLatitude = 0;

    places.forEach(place => {
        totalLongitude += place?.geolocation?.coordinates[0];
        totalLatitude += place?.geolocation?.coordinates[1];
    });

    const centerLongitude = totalLongitude / places.length;
    const centerLatitude = totalLatitude / places.length;

    return [centerLongitude, centerLatitude] as [number, number];
}

const calculateCenter2points = (point1: Coordinates, point2: Coordinates) => {
    const totalLongitude = point1[0] + point2[0];
    const totalLatitude = point1[1] + point2[1];

    const centerLongitude = totalLongitude / 2;
    const centerLatitude = totalLatitude / 2;

    return [centerLongitude, centerLatitude] as [number, number];
}

const minToHour = (min: number) => {
    const hour = Math.floor(min / 60);
    const minute = min % 60;
    return `${hour} giờ ${minute} phút`;
}

export { useProvinceName, useDebounce, calculateCenter, calculateCenter2points, minToHour }