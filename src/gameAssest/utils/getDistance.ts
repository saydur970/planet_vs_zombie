import { tyT_Coordinate } from "../../types/game_shared";

export const getDistance = 
({first, second}: {first: tyT_Coordinate, second: tyT_Coordinate}): number => {
  const xDifference = first.x - second.x;
  const yDifference = first.y - second.y;
  const distance = Math.sqrt(
    Math.pow(xDifference, 2) + Math.pow(yDifference, 2)
  );
  return distance;
}