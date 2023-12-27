import { FC, Dispatch, SetStateAction } from 'react';
import { Plot } from '../../gameAssest/blueprint/plot';
import { Zombie } from '../../gameAssest/blueprint/zombie';
import { isZombieEnd, tyT_gameStatus } from '.';

interface IComp {
  ctx: CanvasRenderingContext2D;
  plotList: Plot[][];
  zombieList: Zombie[];
  gameStatus: tyT_gameStatus;
  setGameStatus: Dispatch<SetStateAction<tyT_gameStatus>>
}

let isGameLose = false;
let isGameWon = false;

export const Animate: FC<IComp> = 
({ctx, plotList, zombieList, gameStatus, setGameStatus}) => {

  const img = document.getElementById('game_map_image') as CanvasImageSource;

  const animate = () => {

    ctx.drawImage(img, 0, 0);

    // ========================= draw zombieList =========================
    for(let i=zombieList.length-1; i>=0; i--) {

      const currentZombie = zombieList[i];

      // check if zombie has died
      if(currentZombie.health <= 0) {

        zombieList.splice(i, 1);

        if(isZombieEnd) {
          // isGameWon = true;
          // setGameStatus('won');
        }
      }

      currentZombie.update(ctx, plotList);

      if(currentZombie.doesZombieReached()) {
        isGameLose = true;
        // setGameStatus('lose');
      }

    }


    // ========================= draw plotList =========================
    plotList.forEach(row => {

      row.forEach(column => {

        // check if el has plant
        if(column.plant) {

          // check health of plant
          if(column.plant.health <= 0) {
            column.plant = null;
          }
          else {
            column.plant.update({ctx, zombieList});
          }


        }

      })
    });

    if(!isGameLose && !isGameWon) {
      requestAnimationFrame(animate);
    }


  }

  animate();

  return null;
};