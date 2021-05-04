import React, { memo } from "react";
import { Button } from "@material-ui/core";

const SteppingStoneCount = (props) => {
  const {
    matrix,
    points,
  } = props;

  const getDeepClone = () => JSON.parse(JSON.stringify(matrix));

  const getNewCoordinatePlus = function (start, end, index, from = 'top') {
    for (
      let newCoordinate = start;
      newCoordinate < end;
      newCoordinate++
    ) {
      let cell = {};
      let cordinateArray = [];
      if (from === 'top') {
        cell = matrix[index][newCoordinate]
        cordinateArray = [index, newCoordinate]
      }
      else if (from === 'bottom') {
        cell = matrix[newCoordinate][index]
        cordinateArray = [newCoordinate, index]
      }
      // const OXSecondCoordinate = matrix[index][newCoordinate];
      if (cell.x) {
        // наша вторая координата OX
        return cordinateArray;
      }
    }
  }

  const getNewCoordinateMinus = (start, end, index, from = 'top') => {
    //  если top, то определяется OY, возвращается [newCoordinate, col]
    //  если bottom, то OX, возвращается [row, newCoordinate] 
    for (
      let newCoordinate = start;
      newCoordinate > end;
      newCoordinate--
    ) {
      let cell = {};
      let cordinateArray = [];
      if (from === 'top') {
        cell = matrix[newCoordinate][index]
        cordinateArray = [newCoordinate, index]
      }
      else if (from === 'bottom') {
        cell = matrix[index][newCoordinate]
        cordinateArray = [index, newCoordinate]
      }
      if (cell.x) {
        return cordinateArray;
      }
    }
  }

  const getNewOXCoordinateForBottomNullCell = (start, end, rowIndex) => {

  }
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

        let indexOX = null;
        let indexOY = null;
        const objOfCoordinat = {};
        if (currentCell.x === 0) {
          // мы нашли пустую клетку
          tempMatrix[row][col].x = 1;
          objOfCoordinat.original = [row, col];
          // ПОИСК БОКОВЫХ НЕПУСТЫХ ГРАНИЦ
          if (haveFullX) {
            // ищем ближайщую НЕпустую клетку справа
            for (let leftCol = col - 1; leftCol >= 0; leftCol--) {
              if (matrix[row][leftCol].x !== 0) {
                tempMatrix[row][leftCol].x--;
                indexOX = leftCol;
                objOfCoordinat.OX1 = [row, leftCol];
                // console.log('#######', matrix[row][rigthCol], '#######')
                break;
              }
            }

            for (let bottomRow = row + 1; bottomRow < rowCount; bottomRow++) {
              if (matrix[bottomRow][col].x) {
                tempMatrix[bottomRow][col].x--;
                indexOY = bottomRow;
                objOfCoordinat.OY1 = [bottomRow, col];
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
                indexOX = rigthCol;
                objOfCoordinat.OX1 = [row, rigthCol];
                // console.log('#######', matrix[row][rigthCol], '#######')
                break;
              }
            }

            // тк у нас нет впереди значений, то поиск по оси ОУ будет вверх
            for (let topRow = row - 1; topRow >= 0; topRow--) {
              if (matrix[topRow][col].x) {
                tempMatrix[topRow][col].x--;
                indexOY = topRow;
                objOfCoordinat.OY1 = [topRow, col];
                break;
              }
            }
          }

          // console.log('indexOX, indexOY', indexOX, indexOY)
          // console.log('objOfCoordinat', objOfCoordinat.original)

          if (tempMatrix[indexOY][indexOX].x) {
            tempMatrix[indexOY][indexOX].x++;
          }
          else {
            // console.log('indexOX, col', indexOX, col)
            // console.log('indexOX < col', indexOX < col)
            if (indexOX < col) {

              // find new OX coordinate
              // for (
              //   let newOXcoordinate = objOfCoordinat.OX1[1];
              //   newOXcoordinate < objOfCoordinat.OY1[1];
              //   newOXcoordinate++
              // ) {
              //   const OXSecondCoordinate = matrix[objOfCoordinat.OY1[0]][newOXcoordinate];
              //   if (OXSecondCoordinate.x) {
              //     // наша вторая координата OX
              //     objOfCoordinat.OX2 = [objOfCoordinat.OY1[0], newOXcoordinate]
              //     console.log('objOfCoordinat.OX2 --', objOfCoordinat.OX2)
              //     break;
              //   }
              // }
              objOfCoordinat.OX2 = getNewCoordinatePlus(objOfCoordinat.OX1[1], objOfCoordinat.OY1[1], objOfCoordinat.OY1[0])
              const [coordinateRowOX2, coordinateColOX2] = objOfCoordinat.OX2
              tempMatrix[coordinateRowOX2][coordinateColOX2].x++;
              // find new OY coordinat
              // for (
              //   let newOYcoordinate = objOfCoordinat.OY1[0];
              //   newOYcoordinate > objOfCoordinat.OX1[0];
              //   newOYcoordinate--
              // ) {
              //   if (matrix[newOYcoordinate][objOfCoordinat.OX1[1]].x) {
              //     objOfCoordinat.OY2 = [newOYcoordinate, objOfCoordinat.OX1[1]]
              //     break;
              //   }
              // }
              // !!!
              objOfCoordinat.OY2 = getNewCoordinateMinus(objOfCoordinat.OY1[0], objOfCoordinat.OX1[0], objOfCoordinat.OX1[1]);
              const [coordinateRowOY2, coordinateColOY2] = objOfCoordinat.OY2
              tempMatrix[coordinateRowOY2][coordinateColOY2].x++;
            }
            else {
              // for (
              //   let newOXcoordinate = objOfCoordinat.OX1[1];
              //   newOXcoordinate > objOfCoordinat.OY1[1];
              //   newOXcoordinate--
              // ) {
              //   const OXSecondCoordinate = matrix[objOfCoordinat.OY1[0]][newOXcoordinate];
              //   // console.log('OXSecondCoordinate.x', OXSecondCoordinate.x)
              //   if (OXSecondCoordinate.x) {
              //     // наша вторая координата OX
              //     objOfCoordinat.OX2 = [objOfCoordinat.OY1[0], newOXcoordinate]


              //     // console.log('OXSecondCoordinate.x', OXSecondCoordinate.x)
              //     console.log(' objOfCoordinat.OX2 ', objOfCoordinat.OX2)
              //     break;
              //   }
              // }
              objOfCoordinat.OX2 = getNewCoordinateMinus(
                objOfCoordinat.OX1[1],
                objOfCoordinat.OY1[1],
                objOfCoordinat.OY1[0],
                'bottom'
              )
              const [coordinateRowOX2, coordinateColOX2] = objOfCoordinat.OX2
              tempMatrix[coordinateRowOX2][coordinateColOX2].x++;
            
              // console.log('objOfCoordinat.OX2',objOfCoordinat.OX2 )

              // find new OY coordinat
              // for (
              //   let newOYcoordinate = objOfCoordinat.OX1[0] - 1;
              //   newOYcoordinate > objOfCoordinat.OY1[0] + 1;
              //   newOYcoordinate--
              // ) {
              //   // console.log('#######',
              //   //   objOfCoordinat.OX1[0] - 1,
              //   //   newOYcoordinate,
              //   //   objOfCoordinat.OY1[0],
              //   //   '#######')
              //   // console.log(
              //   //   `matrix[newOYcoordinate][objOfCoordinat.OX1[1]]`,
              //   //   matrix[newOYcoordinate][objOfCoordinat.OX1[1]]
              //   // )
              //   if (matrix[newOYcoordinate][objOfCoordinat.OX1[1]].x) {
              //     objOfCoordinat.OY2 = [newOYcoordinate, objOfCoordinat.OX1[1]]
              //     console.log('objOfCoordinat.OY2 ', objOfCoordinat.OY2 )
              //     break;
              //   }
              // }
              const newOY = getNewCoordinateMinus(
                objOfCoordinat.OX1[0] - 1,
                objOfCoordinat.OY1[0] + 1,
                objOfCoordinat.OX1[1]
              )
              if(newOY){
                objOfCoordinat.OY2 = newOY;
                const [coordinateRowOY2, coordinateColOY2] = objOfCoordinat.OY2
                tempMatrix[coordinateRowOY2][coordinateColOY2].x++;  
              }
              // // console.log('objOfCoordinat.OY2', objOfCoordinat.OY2)
            }
            // поиск доп непустых клеток куда добавить +1 для уравнивания столбцов и строк
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
