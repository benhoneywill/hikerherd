export const slugify = (string: string, options: { withRandomSuffix?: boolean } = {}) => {
  const slug = string
    .replace(/[^-a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

  const randomSuffix = Math.floor(Math.random() * Date.now()).toString(36);

  return options?.withRandomSuffix ? `${slug}-${randomSuffix}` : slug;
};
