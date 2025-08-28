import { useObjectVal } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { db } from '../lib/firebase';

type BudgetData = {
  budget: number;
  cashTotal: number;
  gcashTotal: number;
};

export function useBudget() {
  const [value] = useObjectVal<BudgetData>(ref(db, 'budget'));
  return value;
}
