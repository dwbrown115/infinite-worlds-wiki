import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import firebase_app from "../firebase/config";

async function replaceImage(array, ContentType, StorageRef, content) {
  const storage = getStorage(firebase_app);
  const collection = "content";
  {
    array.content.map(async (item) => {
      // const image = item.sectionImage;
      if (item.sectionImage != null) {
        // console.log(image);
        const contentName = content;
        const contentType = ContentType;
        const storageRef = StorageRef;
        const section = `Section_${item.sectionName}_${item.sectionImage.name}`;
        const contentRef = ref(
          storage,
          `${collection}/${contentName}/${contentType}/${storageRef}/${section}`
        );
        try {
          await uploadBytes(contentRef, item.sectionImage).then(
            (snapshot) => {
              getDownloadURL(snapshot.ref).then((url) => {
                item.sectionImage = url;
                return item.sectionImage;
              });
            }
          );
        } catch (e) {
          console.log(e);
        }
        // console.log(item); 
        return item
      }
    });
  }
}

export default replaceImage;
