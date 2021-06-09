import React, { memo, useEffect, useMemo, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import ResaltTable from '../ResaltTable';
import PDF from "../PDF";
import Graph from "../Graph";

const SteppingStoneCount = (props) => {
  const {
    matrix,
    points,
    fuzzyDataControl,
    firstTotalCosts,
    setStep
  } = props;

  const [optimizedMatrixValue, setOptimizedMatrixValue]
    = useState({
      matrix: [],
      // costs: null,
    });

  const [finish, setFinish] = useState(false)
  const [makeOptimize, setMakeOptimize] = useState(false)

  const getDeepClone = (currentMatrix = optimizedMatrixValue.matrix) => JSON.parse(JSON.stringify(currentMatrix));
  const getCorrectKeyForObjOfCoordinat = (key, numberOfCount) => (
    numberOfCount
      ?
      `O${key}${numberOfCount}`
      :
      'original'
  )


  // функция для получения изменения общ стоимости затртат на величину 
  // определяет оптимальнее исходного или нет
  // новая времнная матрица
  const getValueForOptimizeTempMatrix = (
    tempMatrix,
    objOfCoordinat,
  ) => {
    // objOfCoordinat : {
    // OX1: (2) [0, 3]
    // OY1: (2) [1, 4]
    // finish: (2) [1, 3]
    // original: (2) [0, 4]
    // }

    // или

    // objOfCoordinat : {
    // OX1: (2) [0, 3]
    // OX2: (2) [1, 3]
    // OX3: (2) [1, 5]
    // OY1: (2) [2, 7]
    // OY2: (2) [2, 5]
    // OY3: (2) [1, 5]
    // finish: (2) [1, 5]
    // original: (2) [0, 7]
    // }
    // console.log('#######', optimizedMatrixValue.matrix, '#######')
    // console.log('tempMatrix in getValueForOptimize', tempMatrix)

    // пофиксить поиск ближней границы ! поиск идет некоррекнто
    //   if(objOfCoordinat.original[0]===4 && objOfCoordinat.original[1]===3 ){
    //     console.log('objOfCoordinat',objOfCoordinat )
    //   }
    if (objOfCoordinat.original) {

      let setOfCoordinat = new Set();
      let newCostsOneIteration = 0;

      for (const key in objOfCoordinat) {
        let value = objOfCoordinat[key].toString();
        setOfCoordinat.add(value)
      }
      // console.log('optimizedMatrixValue.matrix', optimizedMatrixValue.matrix)
      for (const coordinate of setOfCoordinat) {
        const [row, col] = coordinate.split(',')
        // console.log('tempMatrix[row][col].x ', tempMatrix[row][col].x )

        // !!! ТуТ НЕ ДОЛЖНО ПОЛУЧАТЬСЯ МИНУС 1
        // ПОСМОТеть КООРДИНАТЫ
        const mathSign =
          tempMatrix[row][col].x > optimizedMatrixValue.matrix[row][col].x
            ?
            +1
            :
            -1;

        newCostsOneIteration = newCostsOneIteration +
          mathSign * matrix[row][col].c
      }

      return ({
        setOfCoordinat,
        tempMatrix,
        // objOfCoordinat,
      });
    }
  }


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
    const matrix = optimizedMatrixValue.matrix

    for (let leftCol = col - 1; leftCol >= 0; leftCol--) {
      if (matrix[row][leftCol].x !== 0) {
        if (mathSigh === '-') {
          tempMatrix[row][leftCol].x--;
        }
        else {
          tempMatrix[row][leftCol].x++;
        }
        objOfCoordinat[nextCoordinatName] = [row, leftCol];
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
    mathSigh = '+'
  ) => {
    // currentCell - координата текущей ячейки
    const currentCoordinatName =
      getCorrectKeyForObjOfCoordinat(key, numberOfCount)
    const nextCoordinatName = `O${key}${numberOfCount + 1}`;
    const currentCellCoordinate = objOfCoordinat[currentCoordinatName]
    const [row, col] = currentCellCoordinate;
    // надо найти столбец 
    // const colStart = objOfCoordinat['OX1'][1]
    // leftCol ->  
    const colEnd = objOfCoordinat['OX1'][1]
    const colStart = objOfCoordinat['OY1'][1]
    for (let leftCol = colStart; leftCol < colEnd; leftCol++) {
      // for (let leftCol = 0; leftCol < col; leftCol++) {
      if (matrix[row][leftCol].x) {
        if (mathSigh === '+') {
          tempMatrix[row][leftCol].x++;
        }
        else if (mathSigh === '-') {
          tempMatrix[row][leftCol].x--;
        }
        objOfCoordinat[nextCoordinatName] = [row, leftCol];
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
  ) => {
    const currentCoordinatName =
      getCorrectKeyForObjOfCoordinat(key, numberOfCount)

    const nextCoordinatName = `O${key}${numberOfCount + 1}`;
    const currentCellCoordinate = objOfCoordinat[currentCoordinatName]
    const [row, col] = currentCellCoordinate;
    const rowLength = tempMatrix.length;
    const matrix = optimizedMatrixValue.matrix

    for (let bottomRow = row + 1; bottomRow < rowLength; bottomRow++) {
      if (matrix[bottomRow][col].x) {
        tempMatrix[bottomRow][col].x--;
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
    mathSign = '+',
  ) => {
    const currentCoordinatName =
      getCorrectKeyForObjOfCoordinat(key, numberOfCount)

    const nextCoordinatName = `O${key}${numberOfCount + 1}`;
    const currentCellCoordinate = objOfCoordinat[currentCoordinatName]
    const [row, col] = currentCellCoordinate;
    const rowLength = tempMatrix.length;
    // bottomRowStart = y1[0]
    const bottomRowStart = objOfCoordinat['OY1'][0]
    const rowStart = objOfCoordinat['OX1'][0]
    const endRow = objOfCoordinat['OY1'][0]
    for (let bottomRow = rowStart; bottomRow > endRow; bottomRow--) {
      // for (let bottomRow = rowLength - 1; bottomRow > row; bottomRow--) {
      if (matrix[bottomRow][col].x) {
        if (mathSign === '+') {
          tempMatrix[bottomRow][col].x++;
        }
        else if (mathSign === '-') {
          tempMatrix[bottomRow][col].x--;
        }

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
    const matrix = optimizedMatrixValue.matrix

    for (let rigthCol = row + 1; rigthCol < colLength; rigthCol++) {
      if (matrix[row][rigthCol].x) {
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
    mathSign = '-',
  ) => {
    const currentCoordinatName =
      getCorrectKeyForObjOfCoordinat(key, numberOfCount)
    const nextCoordinatName = `O${key}${numberOfCount + 1}`;
    const currentCellCoordinate = objOfCoordinat[currentCoordinatName]
    const [row, col] = currentCellCoordinate;
    const colLength = tempMatrix[0].length;
    // colEnd =
    const colEnd = objOfCoordinat['OY1'][1]
    // colStatrt =
    const colStatrt = objOfCoordinat['OX1'][1]
    for (let rigthCol = colStatrt; rigthCol > colEnd; rigthCol--) {
      // for (let rigthCol = colLength - 1; rigthCol > col; rigthCol--) {
      if (matrix[row][rigthCol].x) {
        if (mathSign === '-') {
          tempMatrix[row][rigthCol].x--;
        }
        else if (mathSign === '+') {
          tempMatrix[row][rigthCol].x++;
        }
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
    // console.log('currentCellCoordinate', currentCellCoordinate)
    const matrix = optimizedMatrixValue.matrix
    for (let topRow = row - 1; topRow >= 0; topRow--) {
      // for (let topRow = row - 1; topRow >= 0; topRow--) {
      // console.log('topRow', topRow)
      if (matrix[topRow][col].x) {
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
    mathSigh = '-',
  ) => {
    const currentCoordinatName =
      getCorrectKeyForObjOfCoordinat(key, numberOfCount)
    const nextCoordinatName = `O${key}${numberOfCount + 1}`;
    const currentCellCoordinate = objOfCoordinat[currentCoordinatName]
    const [row, col] = currentCellCoordinate;

    const startRow = objOfCoordinat['OY1'][0]
    for (let topRow = startRow; topRow < row; topRow++) {
      // for (let topRow = 0; topRow < row; topRow++) {

      if (matrix[topRow][col].x) {
        if (mathSigh === '-') {
          tempMatrix[topRow][col].x--;
        }
        else if (mathSigh === '+') {
          tempMatrix[topRow][col].x++;
        }
        objOfCoordinat[nextCoordinatName] = [topRow, col];
        return { tempMatrix, objOfCoordinat };
      }
    }
  };

  const checkMatrix = (tempMatrix) => {
    const sumRow = tempMatrix.map((row) => {
      return row.reduce((acc, col) => {
        return acc = acc + Number(col.x)
      }, 0)
    })
    const checkRow = sumRow.every((item, index) => {
      return (item === Number(points.departure[index].quality))
    });

    const sumCol = tempMatrix[0].map((col, index) => (
      tempMatrix.reduce((acc, row) => (
        acc = acc + row[index].x
      ), 0)
    ))
    const checkCol = sumCol.every((item, index) => (
      item === Number(points.destination[index].quality)
    ))

    if (!(checkCol && checkRow)) console.error('НЕ ПРОШЛО ПРОВЕРКУ')
  };


  const manageUp = function manageMe(
    tempMatrix,
    objOfCoordinat,
    numberOfCount = 1,
  ) {
    const finishCell = tempMatrix[
      objOfCoordinat[`OY${numberOfCount}`][0]
    ][
      objOfCoordinat[`OX${numberOfCount}`][1]
    ]
    // проверить есть ли завершающая координата
    if (finishCell.x) {
      // есть - значит надо добавить единицу, чтоб уровнять
      // матрицу и завершить цикл
      // условие - добавлять или вычитать 1
      const col = objOfCoordinat[`OX${numberOfCount}`][1];
      let valueInCol = tempMatrix.reduce((acc, item) => (
        acc = acc + item[col].x
      ), 0)
      // valueInCol сложить со всеми остальными в колонке
      const firstValueInCol = Number(points.destination[col].quality)

      const correctValue = valueInCol > firstValueInCol ?
        -1 :
        +1;

      tempMatrix[
        objOfCoordinat[`OY${numberOfCount}`][0]
      ][
        objOfCoordinat[`OX${numberOfCount}`][1]
      ].x += correctValue

      objOfCoordinat.finish = [
        objOfCoordinat[`OY${numberOfCount}`][0],
        objOfCoordinat[`OX${numberOfCount}`][1]
      ]
      checkMatrix(tempMatrix)
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
      }
      else {
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
  };

  const manageDown = function manageMe(
    tempMatrix,
    objOfCoordinat,
    numberOfCount = 1,
  ) {
    const finishCell = tempMatrix[
      objOfCoordinat[`OY${numberOfCount}`][0]
    ][
      objOfCoordinat[`OX${numberOfCount}`][1]
    ]

    if (finishCell.x) {
      // есть - значит надо добавить единицу, чтоб уровнять
      // матрицу и завершить цикл
      // условие - добавлять или вычитать 1
      const col = objOfCoordinat[`OX${numberOfCount}`][1];
      let valueInCol = tempMatrix.reduce((acc, item) => (
        acc = acc + item[col].x
      ), 0)
      // valueInCol сложить со всеми остальными в колонке
      const firstValueInCol = Number(points.destination[col].quality)

      const correctValue = valueInCol > firstValueInCol ?
        -1 :
        +1;

      tempMatrix[
        objOfCoordinat[`OY${numberOfCount}`][0]
      ][
        objOfCoordinat[`OX${numberOfCount}`][1]
      ].x += correctValue

      objOfCoordinat.finish = [
        objOfCoordinat[`OY${numberOfCount}`][0],
        objOfCoordinat[`OX${numberOfCount}`][1]
      ]

      checkMatrix(tempMatrix)
      return tempMatrix;
    }
    else {
      if (numberOfCount % 2 !== 0) {
        // /\ -> +1

        // для  Y ->
        const {
          tempMatrix: newTempMatrixRigth,
          objOfCoordinat: newObjOfCoordinatRigth
        } = findRigthNotNullFurthest(
          tempMatrix,
          objOfCoordinat,
          'Y',
          numberOfCount,
          '+',
        );
        tempMatrix = newTempMatrixRigth;
        objOfCoordinat = newObjOfCoordinatRigth;

        // для X /\
        const {
          tempMatrix: newTempMatrixTop,
          objOfCoordinat: newObjOfCoordinatTop
        } = findTopNotNullFurthest(
          tempMatrix,
          objOfCoordinat,
          'X',
          numberOfCount,
          '+'
        );
        tempMatrix = newTempMatrixTop;
        objOfCoordinat = newObjOfCoordinatTop;
      }
      else {
        // <- \/ -1

        // X <-
        const {
          tempMatrix: newTempMatrixLeft,
          objOfCoordinat: newObjOfCoordinatLeft
        } = findLeftNotNullFurthest(
          tempMatrix,
          objOfCoordinat,
          'X',
          numberOfCount,
          '-',
        )
        tempMatrix = newTempMatrixLeft;
        objOfCoordinat = newObjOfCoordinatLeft;


        // Y \/
        const {
          tempMatrix: newTempMatrixBottom,
          objOfCoordinat: newObjOfCoordinatBottom
        } = findBottomNotNullFurthest(
          tempMatrix,
          objOfCoordinat,
          'Y',
          numberOfCount,
          '-'
        )
        tempMatrix = newTempMatrixBottom;
        objOfCoordinat = newObjOfCoordinatBottom;
      }
      manageMe(tempMatrix, objOfCoordinat, numberOfCount + 1)
    }
  };

  const getDeviationsForFuzzyData = ({ min, normal, max }) => ((2 * normal + min + max) / 2);

  const getTotalCostsByCKey = (basePlan, key = 'c') => (
    basePlan.reduce((acc, item) => {
      return acc = acc + item.reduce((acc, item) => (
        acc = acc + item[key] * item.x
      ), 0)
    }, 0)
  );
  const getFullCostsForFuzzyData = (matrix = optimizedMatrixValue.matrix) => (
    `(${getTotalCostsByCKey(matrix, 'cMin')},${getTotalCostsByCKey(matrix)},${getTotalCostsByCKey(matrix, 'cMax')})`
  )
  const getTotalCosts = (basePlan) => {
    if (fuzzyDataControl) {
      const minTotalCosts = getTotalCostsByCKey(basePlan, 'cMin')
      const totalCosts = getTotalCostsByCKey(basePlan)
      const maxTotalCosts = getTotalCostsByCKey(basePlan, 'cMax')

      const deviation = getDeviationsForFuzzyData({
        min: minTotalCosts,
        normal: totalCosts,
        max: maxTotalCosts,
      })
      return deviation;
      // return {
      //   costs: deviation,
      //   fullCosts: `(
      //     ${minTotalCosts},
      //     ${totalCosts},
      //     ${maxTotalCosts},
      //   )`
      // };
    }
    return getTotalCostsByCKey(basePlan)
  };

  useEffect(() => {
    setOptimizedMatrixValue({
      ...optimizedMatrixValue,
      matrix: matrix,
      costs: getTotalCosts(matrix),
    })
  }, [matrix]);

  const getMinValueFromMinusOne = (
    setOfCoordinat,
    tempMatrix) => {
    let minValues = [];
    const matrix = optimizedMatrixValue.matrix
    // console.log('matrix in getMinValueFromMinusOne', matrix)
    for (const coordinate of setOfCoordinat) {
      const [row, col] = coordinate.split(',')
      if (tempMatrix[row][col].x < matrix[row][col].x) {
        minValues.push(matrix[row][col].x);
      }
    }
    const minValue = minValues.sort((a, b) => {
      return (
        a - b
      )
    })[0]
    return minValue;
  };

  const checkOptimizedPlan = (optimizedMatrix, prevData) => {
    const newCost = getTotalCosts(optimizedMatrix)
    if (prevData.costs > newCost) {
      const data = {
        matrix: optimizedMatrix,
        costs: newCost,
      }
      return data;
    }
    return prevData;
  };


  const changeMatrixForOptimized = (
    {
      setOfCoordinat,
      tempMatrix
    },
    prevData,
  ) => {
    const optimizedMatrix = getDeepClone()
    // console.log('#######', tempMatrix, '#######')
    const minValueX = getMinValueFromMinusOne(setOfCoordinat, tempMatrix)
    const matrix = optimizedMatrixValue.matrix
    // console.log('matrix', matrix)
    // console.log('optimizedMatrixValue.matrix',optimizedMatrixValue.matrix )
    // console.log('tempMatrix in MIN-VAL', tempMatrix)
    // console.log('matrix in CHANGE', matrix)
    for (const coordinate of setOfCoordinat) {
      const [row, col] = coordinate.split(',')
      // console.log('tempMatrix[row][col].x', tempMatrix[row][col].x)
      // // console.log('matrix[row][col].x', matrix[row][col].x)
      if (tempMatrix[row][col].x < matrix[row][col].x) {
        // то надо отнять мин число
        const currentX = optimizedMatrix[row][col].x;
        const newValue = currentX - minValueX;
        optimizedMatrix[row][col].x = optimizedMatrix[row][col].x - minValueX
      }
      else {
        // добавить мин число
        optimizedMatrix[row][col].x = optimizedMatrix[row][col].x + minValueX
      }
    };
    prevData = checkOptimizedPlan(optimizedMatrix, prevData)
    return prevData
  };

  const kek = function makeDeepOptimize(event, currrentData = optimizedMatrixValue, someNewData = {}) {
    // const colCount = matrix[0].length;
    // let prevData = { ...optimizedMatrixValue }
    setFinish(false)

    let prevData = getDeepClone(currrentData);
    const matrix = prevData.matrix;
    const rowCount = matrix.length;
    let tempMatrix = getDeepClone(matrix);

    try {
      for (let row = 0; row < rowCount; row++) {
        const currentRow = matrix[row];

        let haveFullX = false;

        try {
          const normalTempMatrix = getDeepClone(tempMatrix);
          let normalObjOfCoordinat = {};
          for (let col = 0; col < currentRow.length; col++) {
            let currentCell = currentRow[col];
            haveFullX = haveFullX || Boolean(currentCell.x);

            let objOfCoordinat = {};
            if (currentCell.x === 0) {
              // мы нашли пустую клетку
              tempMatrix[row][col].x = 1;
              objOfCoordinat.original = [row, col];

              try {
                // ПОИСКА НЕПУСТЫХ ГРАНИЦ
                normalObjOfCoordinat = getDeepClone(objOfCoordinat);
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

                  manageDown(tempMatrix, objOfCoordinat);
                }
              }
              catch (err) {
                console.error('#######', 'ERROR IN IF', '#######')
                objOfCoordinat = { ...normalObjOfCoordinat, finish: null };
                tempMatrix = normalTempMatrix;
                // если не прошло проверку, то надо ресетнуть матрицу, чтоб не было минусов и плбсов
                break
              }
            }
            const valueForOptimizeTempMatrix = getValueForOptimizeTempMatrix(tempMatrix, objOfCoordinat)
            if (valueForOptimizeTempMatrix) {
              // он будет только для 0 ячеек , иначе андефайнд
              // надо вычислить общие затртары по оптимизированной матрице
              prevData = changeMatrixForOptimized(valueForOptimizeTempMatrix, prevData)
            }
            tempMatrix = getDeepClone();
          }
        }
        catch (err) {
          // console.log('err', err)
          console.log('#######', 'COL ERROR', '#######')
          continue;

        }
        // console.log('prevData.costs', prevData.costs)
        // console.log('someNewData.costs', someNewData.costs)
        if (prevData.costs !== someNewData.costs) {
          setOptimizedMatrixValue(prevData)
          // setFinish(true)
          // makeDeepOptimize(null, prevData)
          // makeDeepOptimize()
          // recursive
        }
      }
    }
    catch (err) {
      console.error('#######', 'ERROR IN KEK', '#######')
    }

// if()
// setFinish(true)
    setMakeOptimize(true)
    setStep(3)
  };

  useEffect(() => {
    if (finish) {
      // console.log('#######', 'use effect TRUE', '#######')
      kek()
    }
  }, [finish])



  return (
    <>
      <Button
        fullWidth
        onClick={kek}
      >
        Оптимизировать затраты - {optimizedMatrixValue.costs}
      </Button>
      {
        makeOptimize
          ?
          (
            <>
              <Typography>
                Самый оптимальный вариант c затратами в {getFullCostsForFuzzyData()} и величиной отклонения  {optimizedMatrixValue.costs} 
              </Typography>
              <ResaltTable
                points={points}
                matrix={optimizedMatrixValue.matrix}
                name='значение'
              />
              {fuzzyDataControl? 
              <Graph value={getFullCostsForFuzzyData()} />
            :
            ''  
            }

              <PDF
                matrix={matrix}
                points={points}
                fuzzyDataControl={fuzzyDataControl}
                firstTotalCosts={firstTotalCosts}
                firstDeviation={getTotalCosts(matrix)}
                optimizedMatrixValue={optimizedMatrixValue}
                optimizedMatrixFullCosts={getFullCostsForFuzzyData(optimizedMatrixValue.matrix)}
              />
            </>
          )
          :
          ''
      }

      {/* 
        :
        ''
      } */}
    </>
  )
};

export default memo(SteppingStoneCount);
