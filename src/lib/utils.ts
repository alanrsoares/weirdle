export const randomInt = (max = Infinity, min = 0) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const capitalize = (word: string) =>
  word[0].toUpperCase().concat(word.slice(1));
