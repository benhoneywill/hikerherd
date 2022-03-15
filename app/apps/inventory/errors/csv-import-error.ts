import type { ZodError } from "zod";

import SuperJson from "superjson";

class CsvImportError extends Error {
  name = "CsvImportError";
  errors: string[] = [];

  constructor(error: ZodError) {
    super("There was an error importing the CSV");
    error.issues.forEach((issue) => {
      issue.path.forEach((path) => {
        this.errors.push(
          `All ${path} values ${issue.message
            .toLowerCase()
            .replace("boolean", "true or false")
            .replace("invalid enum value. expected", "must be")
            .replace("|", "or")}`
        );
      });
    });
  }
}

SuperJson.registerClass(CsvImportError, "CsvImportError");
SuperJson.allowErrorProps("issues");

export default CsvImportError;
