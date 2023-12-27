import { GAME_MEASUREMENT } from "../../../data/game.data";
import { tyT_Coordinate, tyT_Index } from "../../../types/game_shared";
import { randomValueFromInterval } from "../../../utils/randomValueFromInterval";
import { Sun } from "../sun";
import { Zombie } from "../zombie";
import { Plant, tyI_Plant } from "./plant";

interface sunflowerContructor {
  index: tyT_Index;
}

export class Sunflower extends Plant {

  sun: Sun | null;
  duration: number;

  constructor(params: sunflowerContructor) {
    super({ 
      ...params, price: 50, power: 0, range: 0,
      color: '#FFC312', plantType: 'sunflower' 
    });

    this.sun = null;
    this.duration = 1743;

  }

  // ======================== dummy attackOnZombie methods ========================
  action(zombieList: Zombie[]): boolean {

    // if sun is not picked before half time of duration
    if (this.frames >= this.duration / 1.5 && this.sun) {
      this.sun = null;
    }

    // after completed duration, add new sun
    if (this.frames === this.duration) {

      const targetPosition = {
        x: this.position.x + randomValueFromInterval({
          min: 10, max: GAME_MEASUREMENT.plotWidth / 1.2
        }),
        y: this.position.y + randomValueFromInterval({
          min: 10, max: GAME_MEASUREMENT.plotHeight / 1.2
        }),
      }

      this.sun = new Sun({
        sunAmount: 25,
        position: { ...this.position },
        targetPosition: { ...targetPosition }
      })

      // set frame back to zero
      this.frames = 0;

    }


    return true;
  }


  // ======================== handle suns ========================
  handleSun(ctx: CanvasRenderingContext2D) {

    if (this.sun) {
      this.sun.update({ ctx });
    }

  }

  removeSun() {
    this.sun = null;
  }

  extraFunctions(ctx: CanvasRenderingContext2D) {
    this.handleSun(ctx);
  }

}