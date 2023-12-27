import { tyT_Coordinate, tyT_Index } from "../../types/game_shared";
import { getNextPosition } from "../utils/getNextPosition";

interface sunContructor {
  sunAmount: number;
  position: tyT_Coordinate;
  targetPosition: tyT_Coordinate;
}

interface IUpdateParams {
  ctx: CanvasRenderingContext2D;
}

export class Sun {

  sunAmount: number;
  radius: number;
  speed: number;
  targetPosition: tyT_Coordinate;
  position: tyT_Coordinate;

  constructor({ sunAmount, targetPosition, position }: sunContructor) {

    this.sunAmount = sunAmount;
    this.targetPosition = targetPosition;
    this.position = position;
    this.radius = 9;
    this.speed = 0.18;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = 'orange';
    ctx.fill();
  }

  private motion() {

    const nextPos = getNextPosition({
      current: this.position, target: this.targetPosition, speed: this.speed
    })

    this.position.x += nextPos.x;
    this.position.y += nextPos.y;
  }


  update({ctx}: IUpdateParams) {
    this.draw(ctx);
    this.motion();
  }


}