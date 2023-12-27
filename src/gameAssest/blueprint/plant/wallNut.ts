import { tyT_Coordinate, tyT_Index } from "../../../types/game_shared";
import { randomValueFromInterval } from "../../../utils/randomValueFromInterval";
import { Sun } from "../sun";
import { Zombie } from "../zombie";
import { Plant, tyI_Plant } from "./plant";

interface wallNutContructor {
  index: tyT_Index;
}

export class WallNut extends Plant {


  constructor(params: wallNutContructor) {
    super({ 
      ...params, color: 'brown',  health: 5000, price: 50,
      power: 0, range: 0, plantType: 'wall_nut'
    });
  }

  action(zombieList: Zombie[]): boolean {
    return false;
  }

  extraFunctions(ctx: CanvasRenderingContext2D) {}

}