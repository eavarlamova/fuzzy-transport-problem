import { Button, Card, Grid, Input, Typography } from '@material-ui/core';
import React, { memo, useState, useMemo, useCallback, useEffect } from 'react';
import AddingForm from "./components/AddingForm";
import ResaltTable from "./components/ResaltTable";

import './index.scss';

const FormPage = () => {
  const [points, setPoints] = useState({ departure: [], destination: [] }); // пункты отправления и назначения в виде объектов с полямя name и quality
  const [currentPoint, setCurrentPoint] = useState({ departure: {}, destination: {} });
  const [matrix, setMatrix] = useState([])
  const matrix1 = [
    [{ x: 11, c: 11 }, { x: 12, c: 12 }],
    [{ x: 21, c: 21 }, { x: 22, c: 22 }],
    [{ x: 31, c: 31 }, { x: 50, c: null }],
  ];
  useEffect(() => {
    setMatrix(matrix1)
    setPoints({
      departure: [{ name: 'ПО 1' }, { name: 'ПО 2' }, { name: 'ПО 3' }],
      destination: [{ name: 'ПH 1' }, { name: 'ПH 2' }, { name: 'ПH 3' }]
    })
  }, [])


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
              matrix[index][i].x || null
              : null
            : null,
          c: matrix[index]
            ?
            matrix[index][i]
              ?
              matrix[index][i].c || null
              : null
            : null,
        }]
      }
      return [...acc, arr]
    }, [])
    console.log('newArr', newArr)
    setMatrix(newArr);
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

  const handleChangePrice = (departureNumber,  destinationNumder, newValue) => {
    const newMatrix = [...matrix]
    newValue = newValue.trim().replace(/\D/g, '');
    newMatrix[departureNumber][destinationNumder].c = newValue  ? Number(newValue) : null
    // console.log('#######', newMatrix, '#######')
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
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default memo(FormPage)