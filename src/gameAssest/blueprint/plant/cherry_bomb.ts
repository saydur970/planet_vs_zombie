import { Plant } from "./plant";
import { tyT_Coordinate, tyT_Index } from "../../../types/game_shared";
import { Zombie } from "../zombie";


interface plantContructor {
  index: tyT_Index;
}

export class Cherry_bomb extends Plant {

  constructor(params: plantContructor) {

    super({ 
      ...params, color: '#CD001A', price: 150, power: Infinity,
      health: Infinity, range: 0, plantType: 'cherry_bomb' 
    });

  }

  // ======================== dummy attackOnZombie methods ========================
  action(zombieList: Zombie[]): boolean {

    if(this.frames === 50) {
      const list = this.detectZombie({zombieList, selectType: 'arround'});
  
      if(Array.isArray(list)) {
        list.forEach(zombie => zombie.plantAttack(this.power));
      }
  
      this.health = 0;

    }


    return true;
  }



  extraFunctions(ctx: CanvasRenderingContext2D) {
  }

}