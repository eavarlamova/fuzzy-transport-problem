import { Button, Card, Grid, Input, Typography, FormControlLabel, Switch } from '@material-ui/core';
import React, { memo, useState, useMemo, useCallback, useEffect } from 'react';
import AddingForm from "./components/AddingForm";
import ResaltTable from "./components/ResaltTable";
import SteppingStoneCount from "./components/SteppingStoneCount";
import { setDataToLS, getDataFromLS } from '../../helpers/localStorage';
import './index.scss';

const FormPage = () => {
  const [points, setPoints] = useState({ departure: [], destination: [] }); // пункты отправления и назначения в виде объектов с полямя name и quality
  const [currentPoint, setCurrentPoint] = useState({ departure: {}, destination: {} });
  const [matrix, setMatrix] = useState([])
  // const [basePlan, setBasePlan] = useState([]);
  const [fuzzyDataControl, setFuzzyDataControl] = useState(false)
  // const matrix1 = [
  //   [{ x: 11, c: 11, cMin: 0, cMax:10, }, { x: 12, c: 12 }],
  //   [{ x: 21, c: 21 }, { x: 22, c: 22 }],
  //   [{ x: 31, c: 31 }, { x: 50, c: null }],
  // ];
  // useEffect(() => {
  //   setMatrix(matrix1)
  //   setPoints({
  //     departure: [{ name: 'ПО 1' }, { name: 'ПО 2' }, { name: 'ПО 3' }],
  //     destination: [{ name: 'ПH 1' }, { name: 'ПH 2' }, { name: 'ПH 3' }]
  //   })
  // }, [])

  const getCorrectNumberValue = (matrixArray, indexRow, indexCol, key) => (
    matrixArray[indexRow]
      ?
      matrixArray[indexRow][indexCol]
        ?
        typeof (matrixArray[indexRow][indexCol][key]) === 'number' ? matrixArray[indexRow][indexCol][key] : null
        : null
      : null
  );

  const setMatrixField = useMemo(() => {
    const { departure, destination } = points;
    const lengthDestination = destination.length; // кол-во ПН

    const newArr = departure.reduce((acc, item, index) => {
      let arr = [];
      for (let i = 0; i < lengthDestination; i++) {
        arr = [...arr, {
          x: getCorrectNumberValue(matrix, index, i, 'x'),
          c: getCorrectNumberValue(matrix, index, i, 'c'),
          cMin: getCorrectNumberValue(matrix, index, i, 'cMin'),
          cMax: getCorrectNumberValue(matrix, index, i, 'cMax'),
        }]
      }
      return [...acc, arr]
    }, [])
    setMatrix(newArr);
  }, [points])

  const fullnestMatrix = useMemo(() => {
    return (
      fuzzyDataControl ?
        matrix.every(itemRow =>
          itemRow.every(itemCol => typeof (itemCol.c) === 'number'
            && typeof (itemCol.cMin) === 'number'
            && typeof (itemCol.cMax) === 'number'
          )
        )
        :
        matrix.every(itemRow =>
          itemRow.every(itemCol => typeof (itemCol.c) === 'number')
        ))
  }, [matrix])

  useEffect(() => {
    console.log('getDataFromLS(matrix)', getDataFromLS('matrix'))
    const newMatrix = getDataFromLS('matrix') || [];
    const newPoints = getDataFromLS('points') || { departure: [], destination: [] };
    const newFuzzyDataControl = getDataFromLS('fuzzyDataControl' || false)
    console.log('newMatrix in useEffect', newMatrix)
    setMatrix(newMatrix);
    setPoints(newPoints);
    setFuzzyDataControl(newFuzzyDataControl);
  }, [])

  useEffect(() => {
    matrix && setDataToLS('matrix', matrix)
  }, [matrix])

  useEffect(() => {
    setDataToLS('points', points)
  }, [points])

  useEffect(() => {
    setDataToLS('fuzzyDataControl', fuzzyDataControl)
  }, [fuzzyDataControl])

  const handleChange = (value, name, typeOfKey) => {
    console.log('handleChange', value, name, typeOfKey)
    setCurrentPoint({
      ...currentPoint,
      [name]: {
        ...currentPoint[name],
        [typeOfKey]: value,
      }
    })
  };

  const handleChangePrice = (departureNumber, destinationNumder, newValue, key = 'c') => {
    const newMatrix = [...matrix]
    newValue = newValue.trim().replace(/\D/g, '');
    // newMatrix[departureNumber][destinationNumder].c = newValue ? Number(newValue) : null
    newMatrix[departureNumber][destinationNumder][key] = newValue ? Number(newValue) : null;
    // console.log('newMatrix', newMatrix)
    setMatrix(newMatrix)
  };

  const addNewPoint = (pointForSave) => {
    const { name, quality } = currentPoint[pointForSave];
    if (name && name.trim() && quality) {
      setPoints({
        ...points,
        [pointForSave]: [
          ...points[pointForSave],
          {
            name: name.trim(),
            quality,
          },
        ]
      });
      setCurrentPoint({
        ...currentPoint,
        [pointForSave]: {}
      });
    }
  };

  const getTotalCostsByCKey = (basePlan, key = 'c') => (
    basePlan.reduce((acc, item) => {
      return acc = acc + item.reduce((acc, item) => (
        acc = acc + item[key] * item.x
      ), 0)
    }, 0)
  );
  const getTotalCosts = (basePlan) => {
    if (fuzzyDataControl) {
      const minTotalCosts = getTotalCostsByCKey(basePlan, 'cMin')
      const totalCosts = getTotalCostsByCKey(basePlan)
      const maxTotalCosts = getTotalCostsByCKey(basePlan, 'cMax')
      return `(${minTotalCosts}, ${totalCosts}, ${maxTotalCosts})`;
    }
    return getTotalCostsByCKey(basePlan)
  };

  const countBasePlan = () => {
    let allPriceRow = points.departure.map(item => Number(item.quality))
    let allPriceCol = points.destination.map(item => Number(item.quality))

    // updateMatrix - is a matrix with base plan and costs
    const updateMatrix = matrix.map((item, indexRow) => {
      // let priceRow = Number(points.departure.quality);
      // let priceCol = Number(points.destination.quality);
      return item.map((item, indexCol) => {
        let priceRow = allPriceRow[indexRow];
        let priceCol = allPriceCol[indexCol];

        if (priceCol === 0 || priceRow === 0) return { ...item, x: 0 }

        const newX = priceRow < priceCol ? priceRow : priceCol;

        allPriceRow[indexRow] = priceRow - newX;
        allPriceCol[indexCol] = priceCol - newX;
        return { ...item, x: newX }
      })
    })
    setMatrix(updateMatrix);
  };

  const deletePoint = (key, indexForDelete) => {
    const newPoints = { ...points, [key]: points[key].filter((item, index) => indexForDelete !== index) }
    let newMatrix = [...matrix];
    if (key === 'departure') {
      newMatrix = matrix.filter((item, index) => index !== indexForDelete)
    }
    else if (key === 'destination') {
      newMatrix = matrix.map((item, index) => (
        item.filter((item, index) => index !== indexForDelete)
      ))

    }

    setMatrix(newMatrix)
    setPoints(newPoints);
  };
  const setFuzzyInput = () => {
    setFuzzyDataControl(!fuzzyDataControl)
  }

  return (
    <div className="form">
      <Grid
        container
        className="form__add"
        justify='space-around'
      >
        <AddingForm
          name='ПУНКТ ОТПРАВЛЕНИЯ'
          type='departure'
          handleChange={handleChange}
          addNewPoint={addNewPoint}
          currentPoint={currentPoint.departure}
        />
        <AddingForm
          name='ПУНКТ НАЗНАЧЕНИЯ'
          type='destination'
          handleChange={handleChange}
          addNewPoint={addNewPoint}
          currentPoint={currentPoint.destination}
        />
        <Grid item xs={12}>

          <FormControlLabel
            control={<Switch checked={fuzzyDataControl} onChange={setFuzzyInput} />}
            label="нечеткие данные"
          />
        </Grid>
        <Grid item xs={12} >
          <ResaltTable
            points={points}
            matrix={matrix}
            handleChangePrice={handleChangePrice}
            name='стоимость'
            deletePoint={deletePoint}
            fuzzyDataControl={fuzzyDataControl}
          />
          {/* {fullnestMatrix ? */}
          <Button
            fullWidth
            onClick={countBasePlan}
          >
            посчитать опорный план
            </Button>
          {/* :
            <Button
              fullWidth
              disabled
            >
              посчитать опорный план
            </Button>
          } */}


          ОПОРНЫЙ ПЛАН
          <ResaltTable
            points={points}
            matrix={matrix}
            name='значение'
          />
          ОБЩИЕ ЗАТРТАТЫ - {getTotalCosts(matrix)}
{console.log('matrix in FORM', matrix)}
          <SteppingStoneCount
            matrix={matrix}
            points={points}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default memo(FormPage)