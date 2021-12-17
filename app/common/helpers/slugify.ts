type SlugifyOptions = {
  withRandomSuffix?: boolean;
};

const slugify = (string: string, options: SlugifyOptions = {}) => {
  let slug = string
    .replace(/[^-a-zA-Z0-9\s]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .toLowerCase();

  if (options.withRandomSuffix) {
    const randomSuffix = Math.floor(Math.random() * Date.now()).toString(36);
    slug = `${slug}-${randomSuffix}`;
  }

  return encodeURIComponent(slug);
};

export default slugify;
