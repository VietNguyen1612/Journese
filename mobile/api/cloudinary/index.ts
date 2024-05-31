export const uploadImage = async (image: any) => {
    const cloudName = "dagrjsl7q"; // replace with your Cloudinary cloud name
    const uploadPreset = "h2f2kkha"; // replace with your Cloudinary upload preset
    const apiKey = "337788257475731"; // replace with your Cloudinary API key

    const imageUpload = {
        uri: image,
        type: `image/${image?.split(".").pop()}`,
        name: `image.${image?.split(".").pop()}`,
    };
    const formData = new FormData();
    formData.append("file", imageUpload as any);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);
    formData.append("api_key", apiKey);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        return data.secure_url
    } catch (error) {
        console.log(error);
    }
}
