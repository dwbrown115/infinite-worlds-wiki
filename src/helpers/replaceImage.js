import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import firebase_app from "../firebase/config";
import makeid from "./randomString";

function replaceImage(array, contentType) {
  const storage = getStorage(firebase_app);
  const collection = "content";
  array.map((item) => {
    {
      item.content.map((item) => {
        {
          item.content.map(async (item) => {
            const contentRef = ref(
              storage,
              `/${collection}/${contentType}/${item.sectionImage.name}+${makeid(
                16
              )}`
            );
            await uploadBytes(contentRef, item.sectionImage).then(
              (snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                  // console.log(url);
                  item.sectionImage = url;
                  return item.sectionImage;
                });
              }
            );
            // console.log(item.sectionImage);
          });
        }
      });
    }
  });
}

export default replaceImage;
