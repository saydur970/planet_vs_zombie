import { GAME_MEASUREMENT } from "../../data/game.data";
import { tyT_Coordinate } from "../../types/game_shared";

export const getCenterPositon = (position: tyT_Coordinate): tyT_Coordinate => {

  return {
    x: position.x + GAME_MEASUREMENT.plotWidth/2, 
    y: position.y + GAME_MEASUREMENT.plotHeight/2, 
  }

}