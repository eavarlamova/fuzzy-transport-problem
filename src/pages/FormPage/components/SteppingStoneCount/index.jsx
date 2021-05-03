import React, { memo } from "react";
import { Button } from "@material-ui/core";

const SteppingStoneCount = (props) => {
  const {
    matrix,
    points,
  } = props;

  const getDeepClone = () => JSON.parse(JSON.stringify(matrix));

  const kek = () => {
    let findCol = null;
    // const updateMatrix = 
    // matrix.map((row, rowIndex) => {

    //   return (
    //     row.map((cell, colIndex, row) => {
    //       if(cell.x === 0) {
    //         // +1
    //         for (let i = colIndex; i >= 0; i--){
    //           if(row[i].x !== 0) {
    //             row[i].x++;
    //             findCol = i;
    //             break;
    //           }
    //         } 
    //         // return {...cell, x: +1}

    //       }
    //       return ()
    //     })
    //   )
    // })
    const rowCount = matrix.length;
    const colCount = matrix[0].length;

    // const tempMatrix = matrix
    let tempMatrix = getDeepClone()
    for (let row = 0; row < matrix.length; row++) {
      const currentRow = matrix[row];

      let haveFullX = false;
      for (let col = 0; col < currentRow.length; col++) {
        let currentCell = currentRow[col];
        haveFullX = haveFullX || Boolean(currentCell.x);

        if (currentCell.x === 0) {
          // мы нашли пустую клетку
          tempMatrix[row][col].x = 1;

          // ПОИСК БОКОВЫХ НЕПУСТЫХ ГРАНИЦ
          if (haveFullX) {
            // ищем ближайщую НЕпустую клетку справа
            for (let leftCol = col - 1; leftCol >= 0; leftCol--) {
              if (matrix[row][leftCol].x !== 0) {
                tempMatrix[row][leftCol].x--;
                // console.log('#######', matrix[row][rigthCol], '#######')
                break;
              }
            }

            for(let bottomRow = row+1; bottomRow < rowCount; bottomRow++){
              if(matrix[bottomRow][col].x){
                tempMatrix[bottomRow][col].x--;
                // console.log('tempMatrix[bottomRow][col]', tempMatrix[bottomRow][col])
                break;
              }
            }
          }
          else {
            // ищем слева, тк нет справа никаких заполненных не 0 x
            for (let rigthCol = col + 1; rigthCol < colCount; rigthCol++) {
              if (matrix[row][rigthCol].x !== 0) {
                tempMatrix[row][rigthCol].x--;
                // console.log('#######', matrix[row][rigthCol], '#######')
                break;
              }
            }

            // тк у нас нет впереди значений, то поиск по оси ОУ будет вверх
            for(let topRow = row-1; topRow >= 0; topRow--){
              if(matrix[topRow][col].x){
                tempMatrix[topRow][col].x--;
                break;
              }
            }
          }





          console.log('#######', tempMatrix, '#######')
        }
        tempMatrix = getDeepClone();
        // обнулить темпМатрикс
        // посчитать y[row][col] по темпМатрикс
      }
      // console.log('row', row)
    }
  };


  return (
    <Button
      fullWidth
      onClick={kek}
    >
      Оптимизировать затраты 1
    </Button>
  )
};

export default memo(SteppingStoneCount);
