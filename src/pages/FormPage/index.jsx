import React, { memo, useState, useMemo, useEffect } from 'react';
import { Button, Grid, FormControlLabel, Switch } from '@material-ui/core';

import AddingForm from "./components/AddingForm";
import ResaltTable from "./components/ResaltTable";
import StepperProgress from './components/StepperProgress';
import SteppingStoneCount from "./components/SteppingStoneCount";
import { setDataToLS, getDataFromLS } from '../../helpers/localStorage';
import './index.scss';


const FormPage = () => {
  const [points, setPoints] = useState({ departure: [], destination: [] }); // пункты отправления и назначения в виде объектов с полямя name и quality
  const [currentPoint, setCurrentPoint] = useState({ departure: {}, destination: {} });
  const [matrix, setMatrix] = useState([])
  const [fuzzyDataControl, setFuzzyDataControl] = useState(false)
  const [makeBasePlan, setMakeBasePlan] = useState(false);
  const [step, setStep] = useState(0);

  const getDeviationsForFuzzyData = ({ min, normal, max }) => ((2 * Number(normal) + Number(min) + Number(max)) / 2);

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
  }, [matrix, fuzzyDataControl])

  useEffect(() => {
    if (fullnestMatrix && (points.departure.length > 1 || points.destination.length > 1)) {
      setStep(1)
    }
    else {
      setStep(0)
      setMakeBasePlan(false)
    }
  }, [fullnestMatrix])


  useEffect(() => {
    const newMatrix = getDataFromLS('matrix') || [];
    const newPoints = getDataFromLS('points') || { departure: [], destination: [] };
    const newFuzzyDataControl = getDataFromLS('fuzzyDataControl' || false)
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
    newMatrix[departureNumber][destinationNumder][key] = newValue ? Number(newValue) : null;
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
    setMakeBasePlan(true)
    setStep(2);
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
    setMakeBasePlan(false)
  }

  const totalBaseCost = useMemo(() => (
    getTotalCosts(matrix)
  ), [matrix]);

  const totalDeviation = useMemo(() => {
    if (fuzzyDataControl) {

      const lengthOfTotalBasePlan = totalBaseCost.length
      const arrayOfNumber = totalBaseCost.substring(1, lengthOfTotalBasePlan - 1).split(', ');

      const result = getDeviationsForFuzzyData({
        min: (arrayOfNumber[0]),
        normal: arrayOfNumber[1],
        max: arrayOfNumber[2]
      })
      return result
    }
    return ''
  }, [totalBaseCost])

  return (
    <div className="form">
      <StepperProgress step={step}>

      </StepperProgress>
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
          {
            points.departure.length || points.destination.length
              ?
              (
                <>
                  <ResaltTable
                    points={points}
                    matrix={matrix}
                    handleChangePrice={handleChangePrice}
                    name='стоимость'
                    deletePoint={deletePoint}
                    fuzzyDataControl={fuzzyDataControl}
                  />

                  {fullnestMatrix ?
                    <Button
                      fullWidth
                      onClick={countBasePlan}
                    >
                      посчитать опорный план
                    </Button>
                    :
                    <Button
                      fullWidth
                      disabled
                    >
                      посчитать опорный план
                    </Button>
                  }
                </>
              )
              :
              ''
          }

          {
            makeBasePlan
              ?
              (
                <>
                  ОПОРНЫЙ ПЛАН
                  <ResaltTable
                    points={points}
                    matrix={matrix}
                    name='значение'
                  />
                  ОБЩИЕ ЗАТРТАТЫ - {totalBaseCost}
                  <br />
                  {fuzzyDataControl
                    ?
                    `ВЕЛИЧИНА ОТКЛОНЕНИЯ -  ${totalDeviation}`
                    :
                    ''
                  }
                  <SteppingStoneCount
                    matrix={matrix}
                    points={points}
                    fuzzyDataControl={fuzzyDataControl}
                    firstTotalCosts={totalBaseCost}
                    setStep={setStep}
                  />
                </>
              )
              :
              ''
          }
        </Grid>
      </Grid>
    </div>
  );
};

export default memo(FormPage)