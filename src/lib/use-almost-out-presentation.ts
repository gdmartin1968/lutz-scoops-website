import { useEffect } from 'react';
import { startAlmostOutPresentation } from './almost-out-presentation';
export function useAlmostOutPresentation() {
  useEffect(() => startAlmostOutPresentation(document.documentElement), []);
}
