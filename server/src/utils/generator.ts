import { readFileSync } from 'fs';
import { capitalize } from 'lodash';
import { join } from 'path';

const animalsFilePath = join(__dirname, 'data', 'animals.json');
const animalsData = readFileSync(animalsFilePath);
const animals: string[] = JSON.parse(animalsData.toString());

export function generateAnimalName() {
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return capitalize(animal);
}
