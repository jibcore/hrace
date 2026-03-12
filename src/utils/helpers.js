const COLOR_LETTERS = "0123456789ABCDEF";

export const getRandomColor = () => {
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += COLOR_LETTERS[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const generateRacers = (count) => {
  const racers = [];
  for (let i = 1; i <= count; i++) {
    racers.push({
      id: i,
      name: `Horse ${i}`,
      condition: Math.floor(Math.random() * 100) + 1,
      color: getRandomColor(),
    });
  }
  return racers;
};
