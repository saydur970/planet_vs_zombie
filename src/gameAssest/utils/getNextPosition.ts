import { tyT_Coordinate } from "../../types/game_shared";



export const getNextPosition = 
({ current, target, speed }: 
  {current: tyT_Coordinate, target: tyT_Coordinate, speed?: number}): 
  tyT_Coordinate => {

  // get the slope ( m = tanx ) between current point and targetPoint
  const dy = target.y - current.y;
  const dx = target.x - current.x;

  // const slope = Math.atan(dy/dx);
  const slope = Math.atan2(dy, dx);

  // now we can use this slope to get distance on x and y cordinate.
  // y = sin(slope)   x = cos(slope)
  // and we know that -1 < sin, cos < -1
  // that's for our x,y will be -1 < x, y < 1

  let currentSpeed = speed || 1;

  return {
    x: Math.cos(slope) * currentSpeed,
    y: Math.sin(slope) * currentSpeed
  }

}