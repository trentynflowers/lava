export type CurrencyType = {
  maxSafePocket: number;
  maxSafeSpace: number;
  maxInventory: number;
  maxPocket: number;
  maxMulti: number;
  minBet: number;
  maxBet: number;
  maxWin: number;
  slots: {
    [slot: string]: [number, number, boolean];
  };
};

export const currencyConfig: CurrencyType = {
  maxSafePocket: 1000000000,
  maxSafeSpace: 10000000000,
  maxInventory: 100000,
  maxPocket: 100000000,
  maxMulti: 200,
  minBet: 100,
  maxBet: 500000,
  maxWin: 2222222,
  slots: {
    // [prop: string]: [doubles, jackpots, canWinOnDouble]
    broken_heart: [1, 3, false],
    middle_finger: [1, 5, false],
    clown: [1, 10, false],
    pizza: [1, 15, false],
    eggplant: [1, 20, false],
    peach: [1, 25, false],
    flushed: [2, 50, false],
    star2: [2, 75, true],
    fire: [2, 250, true],
    four_leaf_clover: [2, 500, true],
  },
};
