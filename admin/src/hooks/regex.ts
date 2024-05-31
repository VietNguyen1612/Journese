export const returnFormattedDate = (date: string) => {
    let newdate = new Date(date);
    let day = String(newdate.getUTCDate()).padStart(2, '0');
    let month = String(newdate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based in JavaScript
    let year = newdate.getUTCFullYear();
    let hours = String(newdate.getUTCHours()).padStart(2, '0');
    let minutes = String(newdate.getUTCMinutes()).padStart(2, '0');
    let formattedDate = `${day}-${month}-${year}`;
    return formattedDate
}

export const VIETNAM_PROVINCES = {
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


