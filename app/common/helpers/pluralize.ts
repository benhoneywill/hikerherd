const pluralize = (count: number, noun: string, pluralNoun?: string) => {
  let name = noun;

  if (count !== 1) {
    name = pluralNoun || noun + "s";
  }

  return `${count} ${name}`;
};

export default pluralize;
