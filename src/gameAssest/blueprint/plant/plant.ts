import { tyT_Coordinate, tyT_Index, tyT_PlantType } from "../../../types/game_shared";
import { Sun } from "../sun";
import { getCenterPositon } from "../../utils/getCenterPosition";
import { getDistance } from "../../utils/getDistance";
import { Zombie } from "../zombie";
import { GAME_MEASUREMENT } from "../../../data/game.data";

// https://plantsvszombies.fandom.com/wiki/Plants_(PvZ)
// Potato_Mine

interface IUpdateParams {
  ctx: CanvasRenderingContext2D;
  zombieList: Zombie[];
}


export interface tyI_Plant {
  price: number;
  plantType: tyT_PlantType;
  center: tyT_Coordinate;
  redius: number;
  health: number;
  sun?: Sun | null;
  removeSun?(): void;


  // shootsList: Shoot[]; 
  // sunsList: Sun[];

  // draw(ctx: CanvasRenderingContext2D): void;
  zombieAttack(): void;
  update(params: IUpdateParams): void;
}


interface plantContructor {
  price: number;
  plantType: tyT_PlantType;
  power: number;
  health?: number;
  index: tyT_Index;
  range: number;
  color: string;
}

interface IdetectZombieParam {
  zombieList: Zombie[];
  selectType: 'full_column' | 'next_column' | 'arround' | 'same_plot';
}


export abstract class Plant implements tyI_Plant {

  abstract extraFunctions(ctx: CanvasRenderingContext2D): void;
  abstract action(zombieList: Zombie[]): boolean; // if successful attack
  // then return true, else false.

  price: number;
  power: number;
  health: number;
  index: tyT_Index;
  range: number;
  color: string;
  plantType: tyT_PlantType;

  width: number;
  height: number;
  redius: number;
  // isStartFiring: boolean;
  // shootsList: Shoot[]; // bean list
  // sunsList: Sun[]; // sun list

  position: tyT_Coordinate; // get the actual position of plant
  center: tyT_Coordinate; // get the center position of plant
  frames: number; // get timer for attack



  constructor(
    { power, health, index, range, color, plantType, price }: plantContructor
  ) {

    this.price = price;
    this.width = GAME_MEASUREMENT.plotWidth;
    this.height = GAME_MEASUREMENT.plotHeight;
    this.redius = Math.floor(GAME_MEASUREMENT.plotWidth / 3);
    this.frames = 0;
    this.power = power;
    this.health = health || 400;
    this.index = index;
    this.range = range;
    this.color = color;
    this.plantType = plantType;

    this.position = {
      x: this.index.column * this.width,
      y: this.index.row * this.height
    };
    this.center = getCenterPositon(this.position);
    // this.isStartFiring = false;
    // this.shootsList = [];
    // this.sunsList = [];

  }

  // =========================== draw plants ===========================
  private draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, Math.floor(this.redius), 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  // // =========================== draw shoots ===========================
  // private handleShoots(ctx: CanvasRenderingContext2D) {

  //   // draw the shoot, fired by plants
  //   if (this.shootsList.length > 0) {

  //     // the loop must have to start from last index.
  //     // else it will create bug.
  //     // details: js > tower defence game
  //     for (let i = this.shootsList.length - 1; i >= 0; i--) {

  //       const currentShot = this.shootsList[i];

  //       // if shoot has hitted to the zombie
  //       if (currentShot.collusion()) {
  //         // remove the shot from list
  //         this.shootsList.splice(i, 1);
  //       }

  //       currentShot.update(ctx);
  //     }

  //   }

  // } 

  // ====================== the attack of zombie on the plant ======================
  zombieAttack() {
    this.health--;
  }

  // ====================== attack on zombies ======================
  private attack(zombieList: Zombie[]) {

    // attack on zombie
    const willIncreseFrames = this.action(zombieList);

    if (willIncreseFrames) this.frames++;

  }

  // ====================== detect the zombies ======================
  protected detectZombie({ zombieList, selectType }: IdetectZombieParam):
    Zombie | Zombie[] | null {

    // ========================== select for full column 
    if (selectType === 'full_column') {
      const targetZombies = zombieList.filter(zombie => {

        if (zombie.plotIdx.row === this.index.row) {
          // check the range
          const distance = getDistance({
            first: zombie.center, second: this.center
          });

          if (
            ((this.range + 1) * GAME_MEASUREMENT.plotWidth >= distance) &&
            this.center.x <= zombie.center.x
          ) {
            return true;
          }

        }

        return false;
      });


      if (targetZombies.length > 0) {
        // this.isStartFiring = true;
        return targetZombies[0]
      };

    }

    // ========================== select for arround 
    if (selectType === 'arround') {

      const targetZombies = zombieList.filter(zombie => {

        // get distance between zombie and plant
        const distance = getDistance({ first: this.center, second: zombie.center });

        if (
          (
            this.index.row === zombie.plotIdx.row &&
            distance <= GAME_MEASUREMENT.plotWidth * 1.5
          ) ||
          (
            this.index.row !== zombie.plotIdx.row &&
            distance <= GAME_MEASUREMENT.plotHeight * 1.5
          )
        ) {
          return true;
        }

      })

      return targetZombies;

    }

    // ========================== select for same plot
    if (selectType === 'same_plot') {


      const targetZombies = zombieList.filter(zombie => {

        if (
          this.index.row === zombie.plotIdx.row &&
          zombie.center.x <= this.center.x + GAME_MEASUREMENT.plotWidth / 2 &&
          zombie.center.x >= this.center.x - GAME_MEASUREMENT.plotWidth / 2
        ) {
          return true;
        }


      })

      return targetZombies;
    }


    return null;

  }







  public update({ ctx, zombieList }: IUpdateParams) {
    // console.log(this.health)

    this.draw(ctx);
    this.attack(zombieList);
    this.extraFunctions(ctx);
  }



}