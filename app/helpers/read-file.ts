const readFile = (file: Blob) => {
  return new Promise<FileReader>((resolve, reject) => {
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
