import { reject } from "lodash";

const readFile = (file: Blob) => {
  return new Promise<FileReader>((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.addEventListener("load", async ({ target }) => {
      if (target) {
        resolve(target);
      } else {
        reject(new Error("No file reader returned"));
      }
    });

    reader.addEventListener("error", (error) => {
      reject(error);
    });
  });
};

export default readFile;
