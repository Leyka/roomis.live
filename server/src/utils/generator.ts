import { readFileSync } from 'fs';
import { capitalize } from 'lodash';
import { join } from 'path';

const dataPath = join(__dirname, 'data');

// == Animals ==
const animalsPath = join(dataPath, 'animals.json');
const animals: string[] = readToJSON(animalsPath);

/** Pick random animal name from dictionary */
export function generateAnimalName() {
  const animal = pick(animals);
  return capitalize(animal);
}

// == Colors ==
const colorsPath = join(dataPath, 'colors.json');
const colors: string[] = readToJSON(colorsPath);

/** Pick random color from color palettes and returns hexadecimal value */
export function generateHexColorFromPalette() {
  return pick(colors);
}

/** Generate random color in hexadecimal */
export function generateHexColorRandom() {
  return (((1 << 24) * Math.random()) | 0).toString(16);
}

// == Helpers ==

function readToJSON(path: string) {
  const content = readFileSync(path);
  return JSON.parse(content.toString());
}

function pick(data: any[]) {
  return data[Math.floor(Math.random() * data.length)];
}
