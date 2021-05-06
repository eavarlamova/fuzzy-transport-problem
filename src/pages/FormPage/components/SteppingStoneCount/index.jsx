import React, { memo } from "react";
import { Button } from "@material-ui/core";

const SteppingStoneCount = (props) => {
  const {
    matrix,
    points,
  } = props;

  const getDeepClone = () => JSON.parse(JSON.stringify(matrix));
  const getCorrectKeyForObjOfCoordinat = (key, numberOfCount) => (
    numberOfCount
      ?
      `O${key}${numberOfCount}`
      :
      'original'
  )
  // функция для поиска непустых ячеек слева(не нулевых Х) 
  // поиск  20 <=== 0
  const findLeftNotNullNearest = (
    tempMatrix,
    objOfCoordinat,
    key = 'X',  // X по умолчанию, тк первое использование
    //             приходится на поиск ненулевого X по оси OX
    //             для верхних нулевых значений матрицы
    //             т.е. первой проходки от 0
    numberOfCount = 0,
    mathSigh = '-'
  ) => {
    // currentCell - координата текущей ячейки
    const currentCoordinatName =
      getCorrectKeyForObjOfCoordinat(key, numberOfCount)
    const nextCoordinatName = `O${key}${numberOfCount + 1}`;
    const currentCellCoordinate = objOfCoordinat[currentCoordinatName]
    const [row, col] = currentCellCoordinate;

    for (let leftCol = col - 1; leftCol >= 0; leftCol--) {
      if (matrix[row][leftCol].x !== 0) {
        // тут будет корректировака со знаком
        if (mathSigh === '-') {
          tempMatrix[row][leftCol].x--;
        }
        else {
          tempMatrix[row][leftCol].x++;
        }
        objOfCoordinat[nextCoordinatName] = [row, leftCol];
        // console.log('NEW FUN nextCoordinatName', nextCoordinatName)
        // console.log('NEW FUN objOfCoordinat[nextCoordinatName]', objOfCoordinat[nextCoordinatName])
        return { tempMatrix, objOfCoordinat };
      }
    }
  }

  const findLeftNotNullFurthest = (
    tempMatrix,
    objOfCoordinat,
    key = 'X',  // X по умолчанию, тк первое использование
    //             приходится на поиск ненулевого X по оси OX
    //             для верхних нулевых значений матрицы
    //             т.е. первой проходки от 0
    numberOfCount = 0,
    mathSigh = '-'
  ) => {
    // currentCell - координата текущей ячейки
    const currentCoordinatName =
      getCorrectKeyForObjOfCoordinat(key, numberOfCount)
    const nextCoordinatName = `O${key}${numberOfCount + 1}`;
    const currentCellCoordinate = objOfCoordinat[currentCoordinatName]
    const [row, col] = currentCellCoordinate;

    for (let leftCol = 0; leftCol < col; leftCol++) {
      if (matrix[row][leftCol].x) {
        // тут будет корректировака со знаком
        tempMatrix[row][leftCol].x++;
        objOfCoordinat[nextCoordinatName] = [row, leftCol];
        // console.log('NEW FUN nextCoordinatName', nextCoordinatName)
        // console.log('NEW FUN objOfCoordinat[nextCoordinatName]', objOfCoordinat[nextCoordinatName])
        return { tempMatrix, objOfCoordinat };
      }
    }
  }
  // функция для поиска непустых ячеек снизу (не нулевых Х)
  //  0
  //  ||
  // \||/
  //  \/
  //  20
  const findBottomNotNullNearest = (
    tempMatrix,
    objOfCoordinat,
    key = 'Y', // Y по умолчанию, тк первое использование
    //            приходится на поиск ненулевого X по оси OY
    //            для верхних нулевых значений матрицы
    // =          т.е. первой проходки от 0
    numberOfCount = 0,
    mathSign = '-',
  ) => {
    const currentCoordinatName =
      getCorrectKeyForObjOfCoordinat(key, numberOfCount)

    const nextCoordinatName = `O${key}${numberOfCount + 1}`;
    const currentCellCoordinate = objOfCoordinat[currentCoordinatName]
    const [row, col] = currentCellCoordinate;
    const rowLength = tempMatrix.length;

    for (let bottomRow = row + 1; bottomRow < rowLength; bottomRow++) {
      if (matrix[bottomRow][col].x) {
        // тут будет корректировака со знаком
        // if (mathSign === '-') {
        tempMatrix[bottomRow][col].x--;
        // }
        // else {
        // tempMatrix[bottomRow][col].x++;
        // }
        objOfCoordinat[nextCoordinatName] = [bottomRow, col];
        return { tempMatrix, objOfCoordinat };
      }
    }
  };

  const findBottomNotNullFurthest = (
    tempMatrix,
    objOfCoordinat,
    key = 'X', // X по умолчанию, тк это для 2, 4, 6 ...
    //            прохода для изначальной координаты ОХ1
    //            приходится на поиск ненулевого X по оси OY
    //            для верхних нулевых значений матрицы
    // =          т.е. второй проходки от 0
    numberOfCount = 0,
    // mathSign = '-',
  ) => {
    const currentCoordinatName =
      getCorrectKeyForObjOfCoordinat(key, numberOfCount)

    const nextCoordinatName = `O${key}${numberOfCount + 1}`;
    const currentCellCoordinate = objOfCoordinat[currentCoordinatName]
    const [row, col] = currentCellCoordinate;
    const rowLength = tempMatrix.length;

    for (let bottomRow = rowLength - 1; bottomRow > row; bottomRow--) {

      if (matrix[bottomRow][col].x) {
        // тут будет корректировака со знаком
        tempMatrix[bottomRow][col].x++;

        objOfCoordinat[nextCoordinatName] = [bottomRow, col];
        return { tempMatrix, objOfCoordinat };
      }
    }
  };

  // функция для поиска непустых ячеек справа (не нулевых Х)
  // 0 ===> 20
  const findRigthNotNullNearest = (
    tempMatrix,
    objOfCoordinat,
    key = 'X', // X по умолчанию, тк первое использование
    //            приходится на поиск ненулевого X по оси OX
    //            для нижних нулевых значений матрицы
    //            т.е. первой проходки от 0
    numberOfCount = 0,
  ) => {
    const currentCoordinatName =
      getCorrectKeyForObjOfCoordinat(key, numberOfCount)
    const nextCoordinatName = `O${key}${numberOfCount + 1}`;
    const currentCellCoordinate = objOfCoordinat[currentCoordinatName]
    const [row, col] = currentCellCoordinate;
    const colLength = tempMatrix[0].length;

    for (let rigthCol = row + 1; rigthCol < colLength; rigthCol++) {
      if (matrix[row][rigthCol].x) {
        // тут будет корректировака со знаком
        tempMatrix[row][rigthCol].x--;
        objOfCoordinat[nextCoordinatName] = [row, rigthCol];
        return { tempMatrix, objOfCoordinat };
      }
    }
  };


  const findRigthNotNullFurthest = (
    tempMatrix,
    objOfCoordinat,
    key = 'X', // X по умолчанию, тк первое использование
    //            приходится на поиск ненулевого X по оси OX
    //            для нижних нулевых значений матрицы
    //            т.е. первой проходки от 0
    numberOfCount = 0,
  ) => {
    const currentCoordinatName =
      getCorrectKeyForObjOfCoordinat(key, numberOfCount)
    const nextCoordinatName = `O${key}${numberOfCount + 1}`;
    const currentCellCoordinate = objOfCoordinat[currentCoordinatName]
    const [row, col] = currentCellCoordinate;
    const colLength = tempMatrix[0].length;

    for (let rigthCol = colLength - 1; rigthCol > col; rigthCol--) {
      if (matrix[row][rigthCol].x) {
        // тут будет корректировака со знаком
        tempMatrix[row][rigthCol].x++;
        objOfCoordinat[nextCoordinatName] = [row, rigthCol];
        return { tempMatrix, objOfCoordinat };
      }
    }
  };

  // функция для поиска непустых ячеек сверху (не нулевых Х)
  //    20
  //    /\
  //   /||\
  //    ||
  //    0
  const findTopNotNullNearest = (
    tempMatrix,
    objOfCoordinat,
    key = 'Y', // Y по умолчанию, тк первое использование
    //            приходится на поиск ненулевого X по оси OY
    //            для нижних нулевых значений матрицы
    //            т.е. первой проходки от 0
    numberOfCount = 0,
  ) => {
    const currentCoordinatName =
      getCorrectKeyForObjOfCoordinat(key, numberOfCount)
    const nextCoordinatName = `O${key}${numberOfCount + 1}`;
    const currentCellCoordinate = objOfCoordinat[currentCoordinatName]
    const [row, col] = currentCellCoordinate;

    for (let topRow = row - 1; topRow >= 0; topRow--) {
      if (matrix[topRow][col].x) {
        // тут будет корректировака со знаком
        tempMatrix[topRow][col].x--;
        objOfCoordinat[nextCoordinatName] = [topRow, col];
        return { tempMatrix, objOfCoordinat };
      }
    }
  };
  const findTopNotNullFurthest = (
    tempMatrix,
    objOfCoordinat,
    key = 'Y', // Y по умолчанию, тк первое использование
    //            приходится на поиск ненулевого X по оси OY
    //            для нижних нулевых значений матрицы
    //            т.е. первой проходки от 0
    numberOfCount = 0,
  ) => {
    const currentCoordinatName =
      getCorrectKeyForObjOfCoordinat(key, numberOfCount)
    const nextCoordinatName = `O${key}${numberOfCount + 1}`;
    const currentCellCoordinate = objOfCoordinat[currentCoordinatName]
    const [row, col] = currentCellCoordinate;

    for (let topRow = 0; topRow < row; topRow++) {
      if (matrix[topRow][col].x) {
        // тут будет корректировака со знаком
        tempMatrix[topRow][col].x--;
        objOfCoordinat[nextCoordinatName] = [topRow, col];
        return { tempMatrix, objOfCoordinat };
      }
    }
  };


  const getNewCoordinatePlus = function (start, end, index, from = 'top') {
    // console.log('start, end, index', start, end, index)
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
        // console.log('cordinateArray!!!', cordinateArray)
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
  };

  // const manage = function manageMe(tempMatrix, objOfCoordinat, col) {
  //   if (tempMatrix[objOfCoordinat.OY1[0]][objOfCoordinat.OX1[1]].x) {
  //     tempMatrix[objOfCoordinat.OY1[0]][objOfCoordinat.OX1[1]].x++;
  //   }
  //   else {
  //     if (objOfCoordinat.OX1[1] < col) {

  //       // find new OX coordinate
  //       objOfCoordinat.OX2 = getNewCoordinatePlus(objOfCoordinat.OX1[1], objOfCoordinat.OY1[1], objOfCoordinat.OY1[0])
  //       const [coordinateRowOX2, coordinateColOX2] = objOfCoordinat.OX2
  //       tempMatrix[coordinateRowOX2][coordinateColOX2].x++;

  //       // find new OY coordinat
  //       objOfCoordinat.OY2 = getNewCoordinateMinus(objOfCoordinat.OY1[0], objOfCoordinat.OX1[0], objOfCoordinat.OX1[1]);
  //       const [coordinateRowOY2, coordinateColOY2] = objOfCoordinat.OY2
  //       tempMatrix[coordinateRowOY2][coordinateColOY2].x++;
  //     }
  //     else {
  //       objOfCoordinat.OX2 = getNewCoordinateMinus(
  //         objOfCoordinat.OX1[1],
  //         objOfCoordinat.OY1[1],
  //         objOfCoordinat.OY1[0],
  //         'bottom'
  //       )
  //       const [coordinateRowOX2, coordinateColOX2] = objOfCoordinat.OX2
  //       tempMatrix[coordinateRowOX2][coordinateColOX2].x++;

  //       // find new OY coordinat
  //       const newOY = getNewCoordinateMinus(
  //         objOfCoordinat.OX1[0] - 1,
  //         objOfCoordinat.OY1[0] + 1,
  //         objOfCoordinat.OX1[1]
  //       )
  //       if (newOY) {
  //         objOfCoordinat.OY2 = newOY;
  //         const [coordinateRowOY2, coordinateColOY2] = objOfCoordinat.OY2
  //         tempMatrix[coordinateRowOY2][coordinateColOY2].x++;
  //       }
  //     }
  //     // поиск доп непустых клеток куда добавить +1 для уравнивания столбцов и строк
  //   }

  //   console.log('tempMatrix', tempMatrix)
  //  };

  // const manage = function manageMe(tempMatrix, objOfCoordinat, numberOfCount = 1) {
  //   let keyCountX = `OX${numberOfCount}`;
  //   let keyCountY = `OY${numberOfCount}`;
  //   let keyCountXNext = `OX${numberOfCount + 1}`
  //   let keyCountYNext = `OY${numberOfCount + 1}`
  //   // console.log('keyCountY', keyCountY)
  //   if (tempMatrix[objOfCoordinat[keyCountY][0]][objOfCoordinat[keyCountX][1]].x) {
  //     tempMatrix[objOfCoordinat[keyCountY][0]][objOfCoordinat[keyCountX][1]].x++;
  //     // return tempMatrix; 
  //     objOfCoordinat.finish = [objOfCoordinat[keyCountY][0], objOfCoordinat[keyCountX][1]]
  //     return;
  //   }
  //   else {
  //     if (objOfCoordinat[keyCountX][1] < objOfCoordinat.original[1]) {

  //       // find new OX coordinate
  //       objOfCoordinat[keyCountXNext] = getNewCoordinatePlus(
  //         objOfCoordinat[keyCountX][1],
  //         objOfCoordinat[keyCountY][1],
  //         objOfCoordinat[keyCountY][0]
  //       )
  //       const [coordinateRowOX2, coordinateColOX2] = objOfCoordinat[keyCountXNext]
  //       tempMatrix[coordinateRowOX2][coordinateColOX2].x++;

  //       // find new OY coordinat
  //       objOfCoordinat[keyCountYNext] = getNewCoordinateMinus(
  //         objOfCoordinat[keyCountY][0],
  //         objOfCoordinat[keyCountX][0],
  //         objOfCoordinat[keyCountX][1]);

  //       //           console.log(' OLD keyCountYNext', keyCountYNext)
  //       // console.log(' OLD objOfCoordinat[keyCountYNext]',  objOfCoordinat[keyCountYNext])

  //       //         findLeftNotNull(keyCountY, tempMatrix, objOfCoordinat, 'Y', 1)
  //       const [coordinateRowOY2, coordinateColOY2] = objOfCoordinat[keyCountYNext]
  //       tempMatrix[coordinateRowOY2][coordinateColOY2].x++;
  //     }
  //     else {
  //       // console.log('objOfCoordinat[keyCountY]', objOfCoordinat[keyCountY])
  //       objOfCoordinat[keyCountXNext] = getNewCoordinateMinus(
  //         objOfCoordinat[keyCountX][1],
  //         objOfCoordinat[keyCountY][1],
  //         objOfCoordinat[keyCountY][0],
  //         'bottom'
  //       )
  //       const [coordinateRowOX2, coordinateColOX2] = objOfCoordinat[keyCountXNext]
  //       tempMatrix[coordinateRowOX2][coordinateColOX2].x++;

  //       // find new OY coordinat
  //       const newOY = getNewCoordinateMinus(
  //         objOfCoordinat[keyCountX][0] - 1,
  //         objOfCoordinat[keyCountY][0] + 1,
  //         objOfCoordinat[keyCountX][1]
  //       )
  //       if (newOY) {
  //         objOfCoordinat[keyCountYNext] = newOY;
  //         const [coordinateRowOY2, coordinateColOY2] = objOfCoordinat[keyCountYNext]
  //         tempMatrix[coordinateRowOY2][coordinateColOY2].x++;
  //       }
  //     }
  //     // поиск доп непустых клеток куда добавить +1 для уравнивания столбцов и строк
  //   }
  //   // console.log('objOfCoordinat', objOfCoordinat)
  //   // manageMe(tempMatrix, objOfCoordinat, col , numberOfCount+1)
  //   // console.log('tempMatrix', tempMatrix)
  // };


  // функция для поиска НЕ первых непустых координат
  // для верхнего уровня матрицы
  const manageUp = function manageMe(
    tempMatrix,
    objOfCoordinat,
    // key = 'X',
    numberOfCount = 1,
  ) {
    // const currentCoordinatName =
    //   getCorrectKeyForObjOfCoordinat(key, numberOfCount)
    // const nextCoordinatName = `O${key}${numberOfCount + 1}`;
    // const currentCellCoordinate = objOfCoordinat[currentCoordinatName]
    const finishCell = tempMatrix[
      objOfCoordinat[`OY${numberOfCount}`][0]
    ][
      objOfCoordinat[`OX${numberOfCount}`][1]
    ]

    // проверить есть ли завершающая координата
    if (finishCell.x) {
      console.log('finishCell', finishCell)
      // есть - значит надо добавить единицу, чтоб уровнять
      // матрицу и завершить цикл
      // условие - добавлять или вычитать 1
      const col = objOfCoordinat[`OX${numberOfCount}`][1];
      // console.log('numberOfCount', numberOfCount)
      let valueInCol = tempMatrix.reduce((acc, item) => (
        acc = acc + item[col].x
      ), 0)
      // valueInCol сложить со всеми остальными в колонке
      const firstValueInCol = Number(points.destination[col].quality)
      const correctValue = valueInCol > firstValueInCol ?
        -1 :
        +1;

      // console.log('valueInCol', valueInCol)
      // console.log('valueInCol', valueInCol)
      tempMatrix[
        objOfCoordinat[`OY${numberOfCount}`][0]
      ][
        objOfCoordinat[`OX${numberOfCount}`][1]
      ].x = tempMatrix[
        objOfCoordinat[`OY${numberOfCount}`][0]
      ][
        objOfCoordinat[`OX${numberOfCount}`][1]
      ].x + correctValue
      objOfCoordinat.finish = [
        objOfCoordinat[`OY${numberOfCount}`][0],
        objOfCoordinat[`OX${numberOfCount}`][1]
      ]
      console.log('objOfCoordinat', objOfCoordinat)
      console.log('tempMatrix END', tempMatrix)
      return tempMatrix;
    }
    else {

      // нет - значит надо найти следующие коордианты,
      // которые могут привести к появлянию финишной ячейки
      if (numberOfCount % 2 !== 0) {
        // \/ <-
        // +1

        // <-
        // это для Y
        const {
          tempMatrix: newTempMatrixLeft,
          objOfCoordinat: newObjOfCoordinatLeft
        } = findLeftNotNullFurthest(
          tempMatrix,
          objOfCoordinat,
          'Y',
          numberOfCount,
          '+',
        )
        tempMatrix = newTempMatrixLeft;
        objOfCoordinat = newObjOfCoordinatLeft;




        // \/
        // это для X
        const {
          tempMatrix: newTempMatrixBottom,
          objOfCoordinat: newObjOfCoordinatBottom
        } = findBottomNotNullFurthest(
          tempMatrix,
          objOfCoordinat,
          'X',
          numberOfCount,
          '+'
        )
        tempMatrix = newTempMatrixBottom;
        objOfCoordinat = newObjOfCoordinatBottom;
        // console.log('tempMatrix', tempMatrix)


      }
      else {
        // 2 4 6 8...
        // -> /\
        //  -1
        const {
          tempMatrix: newTempMatrixRigth,
          objOfCoordinat: newObjOfCoordinatRigth
        } = findRigthNotNullFurthest(
          tempMatrix,
          objOfCoordinat,
          'X',
          numberOfCount,
        );
        tempMatrix = newTempMatrixRigth;
        objOfCoordinat = newObjOfCoordinatRigth;

        // ищем ближайщую НЕпустую клетку сверху
        // тк у нас нет впереди значений, то поиск по оси ОУ будет вверх
        const {
          tempMatrix: newTempMatrixTop,
          objOfCoordinat: newObjOfCoordinatTop,
        } = findTopNotNullFurthest(
          tempMatrix,
          objOfCoordinat,
          'Y',
          numberOfCount
        );
        tempMatrix = newTempMatrixTop;
        objOfCoordinat = newObjOfCoordinatTop;



      }
      manageMe(tempMatrix, objOfCoordinat, numberOfCount + 1)
    }
    // console.log('tempMatrix', tempMatrix)
  };

  const kek = () => {
    // let findCol = null;

    const rowCount = matrix.length;
    const colCount = matrix[0].length;

    let tempMatrix = getDeepClone()
    for (let row = 0; row < matrix.length; row++) {
      const currentRow = matrix[row];

      let haveFullX = false;
      for (let col = 0; col < currentRow.length; col++) {
        let currentCell = currentRow[col];
        haveFullX = haveFullX || Boolean(currentCell.x);

        // let indexOX = null;
        // let indexOY = null;
        let objOfCoordinat = {};
        if (currentCell.x === 0) {
          // мы нашли пустую клетку
          tempMatrix[row][col].x = 1;
          objOfCoordinat.original = [row, col];

          // ПОИСКА НЕПУСТЫХ ГРАНИЦ
          if (haveFullX) {
            // ДЛЯ ВЕРХНЕГО УРОВНЯ МАТРИЦЫ 
            // ищем ближайщую НЕпустую клетку слева
            const {
              tempMatrix: newTempMatrixLeft,
              objOfCoordinat: newObjOfCoordinatLeft
            } = findLeftNotNullNearest(
              tempMatrix,
              objOfCoordinat,
            )
            tempMatrix = newTempMatrixLeft;
            objOfCoordinat = newObjOfCoordinatLeft;

            // ищем ближайщую НЕпустую клетку снизу
            const {
              tempMatrix: newTempMatrixBottom,
              objOfCoordinat: newObjOfCoordinatBottom
            } = findBottomNotNullNearest(
              tempMatrix,
              objOfCoordinat,
            )
            tempMatrix = newTempMatrixBottom;
            objOfCoordinat = newObjOfCoordinatBottom;

            manageUp(tempMatrix, objOfCoordinat)
          }
          else {
            // ДЛЯ НИЖНЕГО УРОВНЯ МАТРИЦЫ
            // ищем ближайщую НЕпустую клетку справа
            // тк нет справа никаких заполненных не 0 x
            const {
              tempMatrix: newTempMatrixRigth,
              objOfCoordinat: newObjOfCoordinatRigth
            } = findRigthNotNullNearest(
              tempMatrix,
              objOfCoordinat
            );
            tempMatrix = newTempMatrixRigth;
            objOfCoordinat = newObjOfCoordinatRigth;

            // ищем ближайщую НЕпустую клетку сверху
            // тк у нас нет впереди значений, то поиск по оси ОУ будет вверх
            const {
              tempMatrix: newTempMatrixTop,
              objOfCoordinat: newObjOfCoordinatTop
            } = findTopNotNullNearest(
              tempMatrix,
              objOfCoordinat
            );
            tempMatrix = newTempMatrixTop;
            objOfCoordinat = newObjOfCoordinatTop;
          }

          // replace manage();
          // manage(tempMatrix, objOfCoordinat)
          // console.log('#######', newMatrix, '#######')
          // if (tempMatrix[objOfCoordinat.OY1[0]][objOfCoordinat.OX1[1]].x) {
          //   tempMatrix[objOfCoordinat.OY1[0]][objOfCoordinat.OX1[1]].x++;
          // }
          // else {
          //   if (objOfCoordinat.OX1[1] < col) {

          //     // find new OX coordinate
          //     objOfCoordinat.OX2 = getNewCoordinatePlus(objOfCoordinat.OX1[1], objOfCoordinat.OY1[1], objOfCoordinat.OY1[0])
          //     const [coordinateRowOX2, coordinateColOX2] = objOfCoordinat.OX2
          //     tempMatrix[coordinateRowOX2][coordinateColOX2].x++;

          //     // find new OY coordinat
          //     objOfCoordinat.OY2 = getNewCoordinateMinus(objOfCoordinat.OY1[0], objOfCoordinat.OX1[0], objOfCoordinat.OX1[1]);
          //     const [coordinateRowOY2, coordinateColOY2] = objOfCoordinat.OY2
          //     tempMatrix[coordinateRowOY2][coordinateColOY2].x++;
          //   }
          //   else {
          //     objOfCoordinat.OX2 = getNewCoordinateMinus(
          //       objOfCoordinat.OX1[1],
          //       objOfCoordinat.OY1[1],
          //       objOfCoordinat.OY1[0],
          //       'bottom'
          //     )
          //     const [coordinateRowOX2, coordinateColOX2] = objOfCoordinat.OX2
          //     tempMatrix[coordinateRowOX2][coordinateColOX2].x++;

          //     // find new OY coordinat
          //     const newOY = getNewCoordinateMinus(
          //       objOfCoordinat.OX1[0] - 1,
          //       objOfCoordinat.OY1[0] + 1,
          //       objOfCoordinat.OX1[1]
          //     )
          //     if (newOY) {
          //       objOfCoordinat.OY2 = newOY;
          //       const [coordinateRowOY2, coordinateColOY2] = objOfCoordinat.OY2
          //       tempMatrix[coordinateRowOY2][coordinateColOY2].x++;
          //     }
          //   }
          //   // поиск доп непустых клеток куда добавить +1 для уравнивания столбцов и строк
          // }
          // console.log('#######', tempMatrix, '#######')
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
