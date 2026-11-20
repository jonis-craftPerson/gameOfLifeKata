export const SURVIVAL_NEIGHBORS: readonly number[] = [2, 3];
export const BIRTH_NEIGHBORS: readonly number[] = [2, 3];

export const survivesWith = (liveNeighbors: number): boolean =>
  SURVIVAL_NEIGHBORS.includes(liveNeighbors);

export const isBornWith = (liveNeighbors: number): boolean =>
  BIRTH_NEIGHBORS.includes(liveNeighbors);
