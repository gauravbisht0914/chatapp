import { v2 as cloudinary } from "cloudinary";

function configCloudinary() {
  cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadProfileImage = async (path) => {
  console.log(process.env.CLOUDINARY_CLOUD_NAME);
  console.log(process.env.CLOUDINARY_API_KEY);
  console.log(process.env.CLOUDINARY_API_SECRET);
  const options = {
    folder: "Post attachments",
    resource_type: "image",
  };
  try {
    const result = await cloudinary.uploader.upload(path, options);
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
};

const deleteProfileImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Failed to delete image");
  }
};

export { configCloudinary, uploadProfileImage, deleteProfileImage };
