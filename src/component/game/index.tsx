import { useState, useEffect, useRef, Fragment, FC } from 'react';
import { Animate } from './animate';
import { Plot, tyT_plotType } from '../../gameAssest/blueprint/plot';
import { availablePlots } from '../../gameAssest/data/plantPlot';
import { tyT_PlantType } from '../../types/game_shared';
import { Zombie } from '../../gameAssest/blueprint/zombie';
import { zombieList_Level_1 } from '../../gameAssest/data/zombie/level_01';
import { GameUI } from './gameUI';
import { GAME_MEASUREMENT } from '../../data/game.data';


// export const GAME_MEASUREMENT = {

//   plotWidth: 96,
//   plotHeight: 128,

//   // plot row: 5, plot column: 11
//   // 96 * 11 = 1056
//   // 128 * 5 = 640

//   canvasWidth: 1056,
//   canvasHeight: 640,

//   totalRow: 5,
//   totalColumn: 11

// }



export let isZombieEnd = false;

type tyT_PlotList = Plot[][];

export type tyT_gameStatus = 'running'|'won'|'lose';

export const Game: FC = () => {

  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [gameStatus, setGameStatus] = useState<tyT_gameStatus>('running');
  const [plotList, setPlotList] = useState<Plot[][]>([]);
  const [zombieList] = useState<Zombie[]>([]);
  const selectedPlantRef = useRef<null|tyT_PlantType>(null);

  // ============================ initiate the canvas ============================
  useEffect(() => {

    if(canvasRef.current) {

      const ct = canvasRef.current.getContext('2d');
      setCtx(ct);
      canvasRef.current.width = GAME_MEASUREMENT.canvasWidth;
      canvasRef.current.height = GAME_MEASUREMENT.canvasHeight;
    }

  }, []);

  // ============================ set the plots ============================
  useEffect(() => {

    if(plotList.length === 0) {

      let newList: tyT_PlotList = []

      availablePlots.forEach((row, rowIdx) => {

        // ----------- create new row -----------
        let newRow: Plot[] = [];

        row.forEach((column, columnIdx) => {

          // const position = {
          //   x: columnIdx*GAME_MEASUREMENT.plotWidth,
          //   y: rowIdx*GAME_MEASUREMENT.plotHeight
          // };
          const idx = { row: rowIdx, column: columnIdx };
          const isCapableForPlant = column === true ? true: false;
          const plotType: tyT_plotType = 
          columnIdx === 0 ? 'end' :
          columnIdx === row.length-1 ? 'start': 'ground';
          const plant = null;

          // check if we can plant on this plot
            newRow = [
              ...newRow,
              new Plot({
                index: {...idx},
                isCapableForPlant,
                plotType,
                plant
              })
            ]
        })


        // ----------- create new column -----------
        newList = [
          ...newList,
          [...newRow]
        ]

      });
      setPlotList([...newList]);
    }

  }, [plotList.length]);



  // ====================== add zombies ======================
  useEffect(() => {

    let currentSecond = 0;

    const timer = setInterval(() => {

      // if(currentSecond === 6) {
      //   console.log('wong')
      //   // setGameStatus('won')
      //   isZombieEnd = true;
      // }
      
      if(currentSecond === zombieList_Level_1[zombieList_Level_1.length-1]?.delay) {
        clearInterval(timer);
        isZombieEnd = true;
        // console.log('is zombie end: ', isZombieEnd)
      }

      const currentZombies = 
      zombieList_Level_1.filter(el => el.delay === currentSecond);

      // console.log(currentZombies);

      if(currentZombies.length > 0) {

        currentZombies.forEach(zombie => {
          zombieList.push(
            new Zombie({ 
              speed: 1, health: 160, xDistance: zombie.xDistance,
              plotIdx: {
                row: zombie.row, 
                // row: randomValueFromInterval({
                //   min: 0, max: GAME_MEASUREMENT.totalRow-1 
                // }), 
                startColumn: GAME_MEASUREMENT.totalColumn -1, endColumn: 0,
              }
            })
          );
        })


      }


      currentSecond++;

    }, 1000);

    return () => {
      clearInterval(timer);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <Fragment>

      <GameUI ctx={ctx} canvasRef={canvasRef} plotList={plotList} 
        selectedPlantRef={selectedPlantRef} 
      />

      {
        canvasRef.current && ctx &&
        <Animate ctx={ctx} plotList={plotList} zombieList={zombieList}
          gameStatus={gameStatus} setGameStatus={setGameStatus}
        />
      }

    </Fragment>
  )

}