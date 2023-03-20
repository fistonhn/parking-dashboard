export const capitalize = (str, spacer = '_') => {
  const words = str.split(spacer);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }

  return words.join(' ');
};
