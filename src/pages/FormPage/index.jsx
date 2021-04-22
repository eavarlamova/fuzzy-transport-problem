import { Button, Card, Grid, Input, Typography } from '@material-ui/core';
import React, { memo, useState } from 'react';
import AddingForm from "./components/AddingForm";
import ResaltTable from "./components/ResaltTable";

import './index.scss';

const FormPage = () => {
  const [points, setPoints] = useState({ departure: [], destination: [] }); // пункты отправления и назначения в виде объектов с полямя name и quality
  const [currentPoint, setCurrentPoint] = useState({ departure: {}, destination: {} });

  const handleChange = (value, name, typeOfKey) => {
    setCurrentPoint({
      ...currentPoint,
      [name]: {
        ...currentPoint[name],
        [typeOfKey]: value,
      }
    })
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
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default memo(FormPage)