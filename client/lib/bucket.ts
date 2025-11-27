import {
  getDownloadURL,
  getMetadata,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "./firebase";
import { v4 as uuidv4 } from "uuid";

type SetProgressFn = React.Dispatch<React.SetStateAction<number[]>>;
type User = { id: string };

const uploadFiles = async (
  files: File[],
  path: string,
  setProgress: SetProgressFn
): Promise<void> => {
  if (files.length === 0) return;

  const promises: Promise<void>[] = [];

  files.forEach((file, i) => {
    const extension = file.name.split(".").pop();
    const fileRef = ref(storage, `${path}/${uuidv4()}.${extension}`);

    const uploadTask = uploadBytesResumable(fileRef, file, {
      contentType: file.type,
    });

    const promise = new Promise<void>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setProgress((prev) => {
            const newProgress = [...prev];
            newProgress[i] = progress;
            return newProgress;
          });
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        () => {
          resolve();
        }
      );
    });

    promises.push(promise);
  });

  await Promise.all(promises);
};

export const uploadItemImage = async (
  files: File[],
  user: User,
  setProgress: SetProgressFn
): Promise<string[]> => {
  const itemId = uuidv4();
  const path = `users/${user.id}/items/${itemId}`;

  await uploadFiles(files, path, setProgress);

  const res = await listAll(ref(storage, path));

  const urlsAndMetadata = await Promise.all(
    res.items.map(async (item) => {
      const metaData = await getMetadata(item);
      const url = await getDownloadURL(item);
      return { url, metaData };
    })
  );

  urlsAndMetadata.sort(
    (a, b) =>
      Date.parse(a.metaData.timeCreated) - Date.parse(b.metaData.timeCreated)
  );

  return urlsAndMetadata.map((item) => item.url)
};
