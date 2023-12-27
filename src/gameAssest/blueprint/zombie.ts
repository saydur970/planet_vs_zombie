import { tyT_Coordinate, tyT_PlantType } from "../../types/game_shared";
import { Plot } from "./plot";
import { getCenterPositon } from "../utils/getCenterPosition";
import { getNextPosition } from "../utils/getNextPosition";
import { GAME_MEASUREMENT } from "../../data/game.data";


type TplotIdx = {
  row: number;
  startColumn: number;
  endColumn: number;
}

interface zombieConstructor {
  // position: tyT_Coordinate;
  // targetPoint: tyT_Coordinate;
  plotIdx: TplotIdx;
  // startPlotIdx: tyT_Index;
  // endPlotIdx: tyT_Index;
  speed: number;
  health: number;
  xDistance?: number;
}


const ingorePlantList: tyT_PlantType[] = ['cherry_bomb', 'potato_mine_ready'];

export class Zombie {

  // width: number;
  // height: number;
  health: number;
  radius: number;
  targetPlot: Plot|null; // the plant/plot where zombie get access to attack

  position: tyT_Coordinate;
  xDistance: number; // keep some distance when more than one zombie 
  // will start from same row
  targetPoint: tyT_Coordinate;
  targetPointCenter: tyT_Coordinate;
  plotIdx: TplotIdx;
  center: tyT_Coordinate; // center position of zombie
  // velocity: tyT_Coordinate;
  speed: number;

  constructor(
    { plotIdx, speed, health, xDistance }: zombieConstructor
  ) {
    this.health = health;
    this.targetPlot = null;
    this.plotIdx = {...plotIdx};
    this.xDistance = xDistance ? xDistance: 0;
    this.position = { // calculate the current positon of zombie
      x: (this.plotIdx.startColumn) * GAME_MEASUREMENT.plotWidth + this.xDistance,
      y: (this.plotIdx.row) * GAME_MEASUREMENT.plotHeight
    };
    this.targetPoint = {
      x: this.plotIdx.endColumn * GAME_MEASUREMENT.plotWidth,
      y: this.plotIdx.row * GAME_MEASUREMENT.plotHeight
    };
    this.center = getCenterPositon(this.position);
    this.targetPointCenter = getCenterPositon(this.targetPoint);

    // this.velocity = { x: 0, y: 0 };
    // this.width = GAME_MEASUREMENT.plotWidth;
    // this.height = GAME_MEASUREMENT.plotHeight;
    this.radius = Math.floor(GAME_MEASUREMENT.plotWidth/3);
    this.speed = speed*0.09;
  }

  // ======================== draw image of zombie ========================
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#353b48';
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // ======================== motion of zombie ========================
  motion() {

    const nextPos = getNextPosition({
      target: this.targetPointCenter, current: this.center, speed: this.speed
    })

    this.position.x += nextPos.x;
    this.position.y += nextPos.y;
    this.center = getCenterPositon(this.position);
  }

  // ======================== if zombie reach to house ========================
  doesZombieReached(): boolean {

    // if(this.center.x <= GAME_MEASUREMENT.plotWidth) {
    if(this.center.x + this.radius <= GAME_MEASUREMENT.plotWidth) {
      return true;
    }

    return false;
  }

  // ============== check if next column is benongs to planet
  // if next column has plant, then return true
  // else false
  planetDetect(plantList: Plot[][]): boolean {

    const currentRow = plantList[this.plotIdx.row];

    // filter plots which are contain plant
    const plantContainer = currentRow.filter(el => el.plant !== null);

    if(plantContainer.length>0) {
      // now check if next plot has a plant
      let hasNextPlotPlant = plantContainer.find( plot => {

        if(plot.plant) { // now zombie lane has a plant

          // ignore some plants
          if(ingorePlantList.includes(plot.plant.plantType)) {
            return false;
          }

          // calculate distance between plant and zombie
          const xDifference = this.center.x - plot.plant.center.x;
          const yDifference = this.center.y - plot.plant.center.y;
          const distance = Math.sqrt(
            Math.pow(xDifference, 2) + Math.pow(yDifference, 2)
          );

          if( // does zombie can attack?
            distance <= this.radius + plot.plant.redius && 
            this.center.x >= plot.plant.center.x 
          ) {
            this.targetPlot = plot; // set the target plot
            return true;
          }

        }

        return false;
        
        
      })
      return hasNextPlotPlant ? true: false;
    }

    return false;


  }

  // ======================== attacked by the plant ========================
  plantAttack(shootPower: number) {
    this.health = this.health - shootPower;
  }


  update(ctx: CanvasRenderingContext2D, plantList: Plot[][]) {
    
    this.draw(ctx);

    // check if zombie get a plant on its lane
    const hasPlant = this.planetDetect(plantList);

    if(hasPlant) {
      // zombie get plant on this lane, now attack on this
      this.targetPlot?.zombieAttack()
    }
    else {
      this.motion();
    }

  }


}