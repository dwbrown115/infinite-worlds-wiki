import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import firebase_app from "../firebase/config";
import makeid from "./randomString";

async function replaceImage(
  image,
  contentName,
  contentType,
  storageRef,
  section
) {
  const storage = getStorage(firebase_app);
  const collection = "content";
  const contentRef = ref(
    storage,
    `${collection}/${contentName}/${contentType}/${storageRef}/${section}`
  );
  try {
    await uploadBytes(contentRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        // image = url;
        return url;
      });
    });
  } catch (e) {
    console.log(e);
  }
  // if (array != null) {
  //   array.map((item) => {
  //     {
  //       item.content.map((item) => {
  //         if (item.content != undefined) {
  //           {
  //             item.content.map(async (item) => {
  //               if (item.sectionImage != null) {
  //                 const contentRef = ref(
  //                   storage,
  //                   `/${collection}/${contentType}/${
  //                     item.sectionImage.name
  //                   }+${makeid(16)}`
  //                 );
  //                 await uploadBytes(contentRef, item.sectionImage).then(
  //                   (snapshot) => {
  //                     getDownloadURL(snapshot.ref).then((url) => {
  //                       // console.log(url);
  //                       item.sectionImage = url;
  //                       return item.sectionImage;
  //                     });
  //                   }
  //                 );
  //               }
  //               // console.log(item.sectionImage);
  //             });
  //           }
  //         }
  //       });
  //     }
  //   });
  // }
}

export default replaceImage;
