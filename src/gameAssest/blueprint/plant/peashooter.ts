import { GAME_MEASUREMENT } from "../../../data/game.data";
import { tyT_Coordinate, tyT_Index } from "../../../types/game_shared";
import { Shoot } from "../shoots";
import { Zombie } from "../zombie";
import { Plant } from "./plant";


interface plantContructor {
  index: tyT_Index;
}


export class PeaShooter extends Plant {

  shootsList: Shoot[];

  constructor(params: plantContructor) {

    super({ 
      ...params, price: 100, power: 20, range: GAME_MEASUREMENT.canvasWidth,
      color: '#009432', plantType: 'peashooter' 
    });

    this.shootsList = [];

  }

  // ========================== attack on zombie process ==========================
  action(zombieList: Zombie[]): boolean {

    // get target zombie
    const targetZombie = this.detectZombie({zombieList, selectType: 'full_column'});

    if (!targetZombie || Array.isArray(targetZombie)) return false;

    if (this.frames === 200) {
      this.shootsList.push(
        new Shoot({
          power: this.power,
          position: { ...this.center },
          targetZombie: targetZombie
        })
      )
      this.frames = 0;
    }

    return targetZombie ? true : false;

  }

  // =========================== draw shoots ===========================
  private handleShoots(ctx: CanvasRenderingContext2D) {

    // draw the shoot, fired by plants
    if (this.shootsList.length > 0) {

      // the loop must have to start from last index.
      // else it will create bug.
      // details: js > tower defence game
      for (let i = this.shootsList.length - 1; i >= 0; i--) {

        const currentShot = this.shootsList[i];

        // if shoot has hitted to the zombie
        if (currentShot.collusion()) {
          // remove the shot from list
          this.shootsList.splice(i, 1);
        }

        currentShot.update(ctx);
      }

    }

  }

  extraFunctions(ctx: CanvasRenderingContext2D) {
    this.handleShoots(ctx);
  }


}