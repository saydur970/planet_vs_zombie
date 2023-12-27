import { useState, FC, MutableRefObject, MouseEvent, Fragment } from 'react';
import { Cherry_bomb } from '../../gameAssest/blueprint/plant/cherry_bomb';
import { PeaShooter } from '../../gameAssest/blueprint/plant/peashooter';
import { Potato_Mine } from '../../gameAssest/blueprint/plant/potato_mine';
import { Sunflower } from '../../gameAssest/blueprint/plant/sunflower';
import { WallNut } from '../../gameAssest/blueprint/plant/wallNut';
import { Plot } from '../../gameAssest/blueprint/plot';
import { tyT_Index, tyT_PlantType } from '../../types/game_shared';
import { canvasClickHandler } from './events/canvasClickHandler';
import { PlantShop } from './plantShop';

interface IComp {
  ctx: CanvasRenderingContext2D | null;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  plotList: Plot[][];
  selectedPlantRef: MutableRefObject<tyT_PlantType | null>;
}

const getPlant = (plantType: tyT_PlantType, plantPosition: tyT_Index) => {
  switch (plantType) {

    case 'sunflower':
      return new Sunflower({
        // range: GAME_MEASUREMENT.canvasWidth,
        index: { ...plantPosition }
      });

    case 'cherry_bomb':
      return new Cherry_bomb({
        // range: GAME_MEASUREMENT.canvasWidth,
        index: { ...plantPosition }
      });

    case 'wall_nut':
      return new WallNut({
        index: { ...plantPosition }
      });

      case 'potato_mine_loading':
        return new Potato_Mine({
          index: { ...plantPosition }
        });

    default:
      return new PeaShooter({
        // range: GAME_MEASUREMENT.canvasWidth,
        // range: 2,
        index: { ...plantPosition }
      });

  }
}

export const GameUI: FC<IComp> = ({ ctx, canvasRef, plotList, selectedPlantRef }) => {


  const [totalSun, setTotalSun] = useState(100);

  // ================ plant click handler ===================


  const canvasOnclick = (e: MouseEvent<HTMLCanvasElement>) => {

    if (!canvasRef.current) return null;

    const rect = canvasRef.current.getBoundingClientRect();

    const mouse = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    const targetPlotIdx = canvasClickHandler({ mouse, plotList });
    if (!targetPlotIdx) return null;

    const targetPlot = plotList[targetPlotIdx.row][targetPlotIdx.column];

    if (!ctx) return null;

    // =========== check if clicked on sun
    if (
      targetPlot.plant && targetPlot.plant.plantType === 'sunflower' &&
      targetPlot.plant.sun
    ) {

      const currentSun = targetPlot.plant.sun;

      let isSunClicked = false;
      const radius = currentSun.radius;
      if (
        mouse.x >= currentSun.position.x - radius && 
        mouse.x <= currentSun.position.x + radius &&
        mouse.y >= currentSun.position.y - radius && 
        mouse.y <= currentSun.position.y + radius
      ) {

        isSunClicked = true;
      }

        if(isSunClicked && targetPlot.plant.removeSun) {
          targetPlot.plant.removeSun();
          setTotalSun(prev => prev + currentSun.sunAmount);
        }

      return null;

    }


    // // =========== check if clicked on sun
    // if (
    //   targetPlot.plant && targetPlot.plant.plantType === 'sunflower' &&
    //   targetPlot.plant.sunsList
    // ) {
    //   const targetSunIdx = targetPlot.plant.sunsList.findIndex(sun => {

    //     const radius = sun.radius;
    //     // const radius = sun.radius * 2;

    //     if (
    //       mouse.x >= sun.position.x - radius && mouse.x <= sun.position.x + radius &&
    //       mouse.y >= sun.position.y - radius && mouse.y <= sun.position.y + radius
    //     ) {

    //       return true;
    //     }
    //     return false;

    //   });

    //   if (targetSunIdx > -1 && targetPlot.plant.removeSun) {

    //     const targetSun = targetPlot.plant.sunsList[targetSunIdx];
    //     const isRemoved = targetPlot.plant.removeSun(targetSunIdx);

    //     if(isRemoved) {
    //       setTotalSun(prev => prev + targetSun.sunAmount);
    //     }


    //     return null;
    //   }

    // }

    // draw on plot
    if (
      targetPlot.isCapableForPlant &&
      targetPlot.plant === null && selectedPlantRef.current
    ) {

      const targetPlant = getPlant(selectedPlantRef.current, targetPlotIdx);

      if (totalSun >= targetPlant.price) {
        targetPlot.plant = targetPlant;
        setTotalSun(prev => prev - targetPlant.price);
        selectedPlantRef.current = null;
      }


    }



  }


  return (

    <Fragment>

      <div style={{ marginBottom: '5rem' }}> {totalSun} </div>

      <div style={{ display: 'flex', justifyContent: 'center' }} >

        <div style={{ position: 'relative', display: 'inline-block' }} >

          <canvas ref={canvasRef} onClick={e => canvasOnclick(e)} ></canvas>

          <PlantShop selectedPlantRef={selectedPlantRef} />

        </div>

      </div>

    </Fragment>

  )

};