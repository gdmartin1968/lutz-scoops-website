import type { DietaryCode } from './public-flavors';

// Meanings for the seven existing canonical codes; no classification rules here.
export const DIETARY_LABELS: Record<DietaryCode, string> = {
  GF: 'Gluten Free', DF: 'Dairy Free', SF: 'Soy Free', NF: 'Nut Free',
  CF: 'Corn Free', EF: 'Egg Free', V: 'Vegan',
};
