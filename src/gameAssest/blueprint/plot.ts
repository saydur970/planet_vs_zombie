import { GAME_MEASUREMENT } from "../../data/game.data";
import { tyT_Coordinate, tyT_Index } from "../../types/game_shared";
import { tyI_Plant } from "./plant/plant";


type tyT_Plant = null| tyI_Plant;

export type tyT_plotType = 'start'| 'end'| 'ground';
// start means - where from zombie will start movment
// end - the door of house
// ground - the warzone

interface plotContructor {
  index: tyT_Index;
  isCapableForPlant: boolean;
  plotType: tyT_plotType;
  plant: tyT_Plant;
}

export class Plot {

  // isOccupied: boolean;
  position: tyT_Coordinate; // get the position of plot
  width: number;
  height: number;

  index: tyT_Index; // the the index of plot
  isCapableForPlant: boolean; // can we plant on this plot?
  plotType: tyT_plotType; // reference of plot
  plant: tyT_Plant;


  constructor({ index, isCapableForPlant, plotType, plant }: plotContructor){
    this.index = index;
    this.isCapableForPlant = isCapableForPlant;
    this.plotType = plotType;
    this.plant = plant;
    this.width = GAME_MEASUREMENT.plotWidth;
    this.height = GAME_MEASUREMENT.plotHeight;
    this.position = {
      x: this.index.column * this.width,
      y: this.index.row * this.height
    };
  }


  // ====================== the attack of zombie on the plot ======================
  zombieAttack() {
    if(this.plant) {
      this.plant.zombieAttack();
      // // check if plant is died
      // if(this.plant.health <= 0) {
      //   this.plant = null;
      // }
    }
  }
  // ====================== disappear plant, after attack ======================
  disappear() {
    this.plant = null;
  }



  draw(ctx: CanvasRenderingContext2D) {
    // if(this.plant) {
    //   ctx.fillStyle = 'red';
    //   ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    // }
  }


}