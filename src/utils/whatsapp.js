import { WA_NUMBER } from '../data/constants';

export function buildWaUrl(text) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
