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


  const kek = () => {
    let findCol = null;

    const rowCount = matrix.length;
    const colCount = matrix[0].length;

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
                break;
              }
            }

            for (let bottomRow = row + 1; bottomRow < rowCount; bottomRow++) {
              if (matrix[bottomRow][col].x) {
                tempMatrix[bottomRow][col].x--;
                indexOY = bottomRow;
                objOfCoordinat.OY1 = [bottomRow, col];
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

          if (tempMatrix[indexOY][indexOX].x) {
            tempMatrix[indexOY][indexOX].x++;
          }
          else {
            if (indexOX < col) {

              // find new OX coordinate
              objOfCoordinat.OX2 = getNewCoordinatePlus(objOfCoordinat.OX1[1], objOfCoordinat.OY1[1], objOfCoordinat.OY1[0])
              const [coordinateRowOX2, coordinateColOX2] = objOfCoordinat.OX2
              tempMatrix[coordinateRowOX2][coordinateColOX2].x++;

              // find new OY coordinat
              objOfCoordinat.OY2 = getNewCoordinateMinus(objOfCoordinat.OY1[0], objOfCoordinat.OX1[0], objOfCoordinat.OX1[1]);
              const [coordinateRowOY2, coordinateColOY2] = objOfCoordinat.OY2
              tempMatrix[coordinateRowOY2][coordinateColOY2].x++;
            }
            else {
              objOfCoordinat.OX2 = getNewCoordinateMinus(
                objOfCoordinat.OX1[1],
                objOfCoordinat.OY1[1],
                objOfCoordinat.OY1[0],
                'bottom'
              )
              const [coordinateRowOX2, coordinateColOX2] = objOfCoordinat.OX2
              tempMatrix[coordinateRowOX2][coordinateColOX2].x++;

              // find new OY coordinat
              const newOY = getNewCoordinateMinus(
                objOfCoordinat.OX1[0] - 1,
                objOfCoordinat.OY1[0] + 1,
                objOfCoordinat.OX1[1]
              )
              if (newOY) {
                objOfCoordinat.OY2 = newOY;
                const [coordinateRowOY2, coordinateColOY2] = objOfCoordinat.OY2
                tempMatrix[coordinateRowOY2][coordinateColOY2].x++;
              }
            }
            // поиск доп непустых клеток куда добавить +1 для уравнивания столбцов и строк
          }
          console.log('#######', tempMatrix, '#######')
        }
        tempMatrix = getDeepClone();
        // обнулить темпМатрикс
        // посчитать y[row][col] по темпМатрикс
      }
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
