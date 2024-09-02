export function getRandomInt(x, y=null) {
    var min, max;
    if (y==null) {
      min = 0;
      max = x;
    } else {
      min = x;
      max = y;
    }

    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export function pickRandom(arr) {
    return arr[getRandomInt(arr.length)]
}

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}
