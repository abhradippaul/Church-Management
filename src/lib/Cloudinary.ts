// import { v2 as cloudinary } from "cloudinary";
import axios from "axios";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

export const uploadCloudinary = async (image: FileList) => {
  try {
    const newFormData = new FormData();
    newFormData.append("file", image[0]);
    newFormData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_CLOUDINARY_URL!,
      newFormData
    );
    console.log(data);
    return data;
  } catch (err) {
    return null;
  }
};

// export const deleteCloudinary = async (public_id: string) => {
//   try {
//     const cloudinaryResponse = await cloudinary.api.delete_resources([
//       public_id,
//     ]);
//     return cloudinaryResponse;
//   } catch (err) {
//     return null;
//   }
// };
