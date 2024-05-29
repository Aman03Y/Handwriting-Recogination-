import { storage } from './firebase';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const uploadImage = async (file) => {
  try {
    const imgRef =  ref(storage,`files/${v4()}`);
    const value = await uploadBytes(imgRef,file);
    const url =  await getDownloadURL(value.ref);
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default uploadImage;