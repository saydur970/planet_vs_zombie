import { tyT_Coordinate, tyT_Index } from "../../types/game_shared";
import { getDistance } from "../utils/getDistance";
import { getNextPosition } from "../utils/getNextPosition";
import { Zombie } from "./zombie";


interface shootsContructor {
  power: number;

  position: tyT_Coordinate;
  targetZombie: Zombie;
}

export class Shoot {

  power: number;
  center: tyT_Coordinate;
  targetZombie: Zombie;
  radius: number;
  speed: number;

  constructor(
    {position, targetZombie, power}: shootsContructor
  ) {
    this.power = power;
    this.center = {...position};
    this.targetZombie = targetZombie;
    this.radius = 6;
    this.speed = 1.8;
  }


  draw(ctx: CanvasRenderingContext2D) {

    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = 'lime';
    ctx.fill();
  }

  // ===================== write the path of shoots =====================
  motion() {

    // console.log(this.targetZombie)

    const nextPos = getNextPosition({
      current: this.center, target: this.targetZombie.center, speed: this.speed
    })

    this.center.x += nextPos.x;
    this.center.y += nextPos.y;
  }

  // ===================== check if shoot has hitted the zombies =====================
  collusion(): boolean {

    // calculate distance between shoot and zombie
    const distance = getDistance({
      first: this.center, second: this.targetZombie.center
    })

    if(distance <= this.radius + this.targetZombie.radius) {
      this.targetZombie.plantAttack(this.power);
      return true;
    }

    return false;
  }


  update(ctx: CanvasRenderingContext2D) {
    this.draw(ctx)
    this.motion();
  }


}