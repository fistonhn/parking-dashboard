function normalize (string = '') {
  return `${string}`.toUpperCase();
}

function isEqualIgnoreCase (string1, string2) {
  return normalize(string1) === normalize(string2);
}

export default isEqualIgnoreCase;
