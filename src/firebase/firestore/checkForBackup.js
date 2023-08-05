import { setBackupArray } from "../../helpers";
import { getData, updateData, addData } from "../index";
export default async function checkForBackup(id, ArrayName, path, contentType) {
    let backup = await setBackupArray(id, ArrayName, path);
    let snap = await getData("/ContentBackup", id);

    await addData(`/ContentBackup/${contentType}/${id}`, ArrayName, backup);

    // console.log(backup);
    // if (snap) {
    //     console.log("exists");
    //     await updateData(
    //         `/ContentBackup/${contentType}/${id}/`,
    //         ArrayName,
    //         backup
    //     );
    // } else if (!snap) {
    //     console.log("does not exist");
    //     await addData(
    //         `/ContentBackup/${contentType}/${id}/`,
    //         ArrayName,
    //         backup
    //     );
    // }
}
