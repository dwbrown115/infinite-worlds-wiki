import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import firebase_app from "../firebase/config";

async function replaceImage(array, ContentType, StorageRef, content) {
    const storage = getStorage(firebase_app);
    const collection = "content";
    let promises = null;

    // console.log(array);
    if (array.length != 0) {
        promises = array.content?.map(async function (item) {
            // const newObj = Object.assign({}, item);
            if (item.sectionImage != null) {
                const contentName = content;
                const contentType = ContentType;
                const storageRef = StorageRef;
                const section = `Section_${item.sectionName}_${item.sectionImage.name}`;
                const contentRef = ref(
                    storage,
                    `${collection}/${contentName}/${contentType}/${storageRef}/${section}`
                );
                try {
                    const snapshot = await uploadBytes(
                        contentRef,
                        item.sectionImage
                    );
                    const url = await getDownloadURL(snapshot.ref);
                    delete item["sectionImage"];
                    item["imageUrl"] = url;
                } catch (e) {
                    console.log(e);
                }
                return item;
            } else if (item.sectionImage == null) {
                delete item.sectionImage;
            }
        });
    }
    if (promises) {
        return Promise.all(promises);
    }
    // return Promise.all(promises);
}

export default replaceImage;
