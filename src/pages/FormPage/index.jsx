import { Button, Card, Grid, Input, Typography } from '@material-ui/core';
import React, { memo, useState, useMemo, useCallback, useEffect } from 'react';
import AddingForm from "./components/AddingForm";
import ResaltTable from "./components/ResaltTable";
import { setDataToLS, getDataFromLS } from '../../helpers/localStorage';
import './index.scss';

const FormPage = () => {
  const [points, setPoints] = useState({ departure: [], destination: [] }); // пункты отправления и назначения в виде объектов с полямя name и quality
  const [currentPoint, setCurrentPoint] = useState({ departure: {}, destination: {} });
  const [matrix, setMatrix] = useState([])
  const [basePlan, setBasePlan] = useState([]);
  // const matrix1 = [
  //   [{ x: 11, c: 11 }, { x: 12, c: 12 }],
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


  const setMatrixField = useMemo(() => {
    const { departure, destination } = points;
    const lengthDestination = destination.length; // кол-во ПН

    const newArr = departure.reduce((acc, item, index) => {
      let arr = [];
      for (let i = 0; i < lengthDestination; i++) {
        arr = [...arr, {
          x: matrix[index]
            ?
            matrix[index][i]
              ?
              typeof (matrix[index][i].x) === 'number' ? matrix[index][i].x : null
              : null
            : null,
          c: matrix[index]
            ?
            matrix[index][i]
              ?
              typeof (matrix[index][i].c) === 'number' ? matrix[index][i].c : null
              : null
            : null,
        }]
      }
      return [...acc, arr]
    }, [])
    setMatrix(newArr);
  }, [points])

  const fullnestMatrix = useMemo(() => {
    return matrix.every(itemRow =>
      itemRow.every(itemCol => typeof (itemCol.c) === 'number')
    )
  }, [matrix])

  useEffect(() => {
    console.log('getDataFromLS(matrix)', getDataFromLS('matrix'))
    const newMatrix = getDataFromLS('matrix') || [];
    const newPoints = getDataFromLS('points') || { departure: [], destination: [] };

    setMatrix(newMatrix);
    setPoints(newPoints);
  }, [])

  useEffect(() => {
    matrix && setDataToLS('matrix', matrix)
  }, [matrix])

  useEffect(() => {
    setDataToLS('points', points)
  }, [points])

  const handleChange = (value, name, typeOfKey) => {
    setCurrentPoint({
      ...currentPoint,
      [name]: {
        ...currentPoint[name],
        [typeOfKey]: value,
      }
    })
  };

  const handleChangePrice = (departureNumber, destinationNumder, newValue) => {
    const newMatrix = [...matrix]
    newValue = newValue.trim().replace(/\D/g, '');
    newMatrix[departureNumber][destinationNumder].c = newValue ? Number(newValue) : null
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

  const getTotalCosts = (basePlan) => (
    basePlan.reduce((acc, item) => {
      return acc = acc + item.reduce((acc, item) => acc = acc + item.c * item.x, 0)
    }, 0)
  );

  const countBasePlan = () => {
    let allPriceRow = points.departure.map(item => Number(item.quality))
    let allPriceCol = points.destination.map(item => Number(item.quality))

    const newBasePlan = matrix.map((item, indexRow) => {
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
    const totalCosts = newBasePlan.reduce((acc, item) => {
      return item.reduce((acc, item) => acc = acc + item.c * item.x, 0)
    }, 0)
    console.log('totalCosts', totalCosts)
    setBasePlan(newBasePlan);
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
    // delete matrix
    setMatrix(newMatrix)
    setPoints(newPoints);
  };


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
        <Grid item xs={12} >
          <ResaltTable
            points={points}
            matrix={matrix}
            handleChangePrice={handleChangePrice}
            name='стоимость'
            deletePoint={deletePoint}
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


          ОПОРНЫЙ ПЛАН
          <ResaltTable
            points={points}
            matrix={basePlan}
            name='значение'
          // handleChangePrice={handleChangePrice}
          />
          ОБЩИЕ ЗАТРТАТЫ - {getTotalCosts(basePlan)}
        </Grid>
      </Grid>
    </div>
  );
};

export default memo(FormPage)