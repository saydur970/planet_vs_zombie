import { GAME_MEASUREMENT } from "../../../data/game.data";
import { Plot } from "../../../gameAssest/blueprint/plot";
import { tyT_Coordinate } from "../../../types/game_shared";

interface IParam {
  mouse: tyT_Coordinate;
  plotList: Plot[][]
}

export const canvasClickHandler = ({mouse, plotList}: IParam) => {

  // ============== get row on playground ================
  let targetRow: null|number = null;
  for(let i=0; i < plotList.length; i++) {
   
    const startLine = GAME_MEASUREMENT.plotHeight * i;
    const endLine = GAME_MEASUREMENT.plotHeight * (i+1);

    if(mouse.y>= startLine && mouse.y<endLine) {
      targetRow = i;
      break;
    }

  }

  if(targetRow === null) return null;

  // ============== get column on playground ================
  let targetColumn: null|number = null;
  for(let i=0; i < plotList[targetRow].length; i++) {
   
    const startLine = GAME_MEASUREMENT.plotWidth * i;
    const endLine = GAME_MEASUREMENT.plotWidth * (i+1);

    if(mouse.x>= startLine && mouse.x<endLine) {
      targetColumn = i;
      break;
    }
  }

  if(targetColumn === null) return null;

  return {
    row: targetRow,
    column: targetColumn
  }
  

}