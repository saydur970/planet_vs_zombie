import { Fragment, FC, Dispatch, SetStateAction, MutableRefObject } from 'react';
import { tyT_PlantType } from '../../types/game_shared';

interface IComp {
  // setSelectedPlant: Dispatch<SetStateAction<tyT_PlantType | null>>
  selectedPlantRef: MutableRefObject<tyT_PlantType | null>
}



export const PlantShop: FC<IComp> = ({ selectedPlantRef }) => {


  const clickHandler = (plant: tyT_PlantType) => {
    selectedPlantRef.current = plant;
  }


  const PlantItem = (plant: tyT_PlantType, color: string) => {

    return (
      <div
        onClick={() => clickHandler(plant)}
        style={{
          width: '6rem',
          height: '6rem',
          backgroundColor: color,
          marginBottom: '2rem'
        }}
      > {plant} </div>
    )
  
  }


  return (
    <Fragment>

      <div style={{
        position: 'absolute', top: 0, left: 0
      }} >

        {PlantItem('cherry_bomb', 'red')}
        {PlantItem('peashooter', 'green')}
        {PlantItem('sunflower', 'orange')}
        {PlantItem('wall_nut', 'brown')}
        {PlantItem('potato_mine_loading', 'silver')}


      </div>

    </Fragment>
  )

};