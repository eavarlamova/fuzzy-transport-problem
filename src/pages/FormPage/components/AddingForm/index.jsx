import React, { memo, useEffect } from "react";
import { Button, Card, Grid, Input, Typography } from '@material-ui/core';

const AddingForm = (props) => {
  const {
    name,
    type,
    addNewPoint,
    handleChange,
    currentPoint,
  } = props;

  const handleChangeQuality = ({ target: { value, name } }) => {
    const newValue = value.replace(/\D/g, '');
    handleChange(newValue, name, 'quality')
  };

  return (
    <Card className="form__add-departure">
      <Typography variant="h5">{name}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={9} >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              addNewPoint(type);
            }}>
            <Input
              className={`form__add-${type}-name`}
              name={type}
              value={currentPoint.name || ''}
              onChange={
                ({ target: { value, name } }) => {
                  handleChange(value, name, 'name')
                }}
              placeholder="название"
              fullWidth
            />
          </form>
        </Grid>
        <Grid item xs={3}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              addNewPoint(type);
            }}>
            <Input
              className={`form__add-${type}-quality`}
              name={type}
              value={currentPoint.quality || ''}
              onChange={handleChangeQuality}
              placeholder="кол-во товара"
              fullWidth
            />
          </form>
        </Grid>
      </Grid>
      <Button
        fullWidth
        onClick={() => addNewPoint(type)}
      >
        добавить
            </Button>
    </Card>
  )
};

export default memo(AddingForm);