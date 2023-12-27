import { tyT_Coordinate, tyT_Index } from "../../../types/game_shared";
import { randomValueFromInterval } from "../../../utils/randomValueFromInterval";
import { Sun } from "../sun";
import { Zombie } from "../zombie";
import { Plant, tyI_Plant } from "./plant";

interface potatoMineContructor {
  index: tyT_Index;
}


export class Potato_Mine extends Plant {

  duration: number; // when potato will be converted on mine

  constructor(params: potatoMineContructor) {
    super({ 
      ...params, price: 50, power: Infinity, range: 0,
      color: 'silver', plantType: 'potato_mine_loading' 
    });

    this.duration = 500; 


  }

  get isMineReady() {
    return this.frames >= this.duration;
  }

    // ======================== dummy attackOnZombie methods ========================
    action(zombieList: Zombie[]): boolean {

      if(this.isMineReady) {

        // get zombie list
        const list = this.detectZombie({zombieList, selectType: 'same_plot'});

        if(Array.isArray(list) && list.length > 0) {
          list.forEach(zombie => zombie.plantAttack(this.power));
          this.health = 0;
        }
    

      }

      return true;
    }

  extraFunctions(ctx: CanvasRenderingContext2D) {

    // reset haalth after converted to mine
    if(this.isMineReady && this.plantType === 'potato_mine_loading') {
      this.plantType = 'potato_mine_ready';
      this.health = Infinity;
      this.color = 'gray';
    }

  }

}