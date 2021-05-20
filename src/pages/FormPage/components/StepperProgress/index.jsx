import { memo } from "react";
import { Stepper, Step, StepLabel } from '@material-ui/core';
import "../../index.scss";

const StepperProgress = ({step}) => {
    const stepsArray = [
        `Ввод данных`,
        `Расчет базового опорного плана`,
        `Оптимизация опорного плана`
    ];

    return (
        <div className='stepper' >
            <Stepper alternativeLabel activeStep={step}>
               {
               stepsArray.map(item => (
                   <Step>
                       <StepLabel>{item}</StepLabel>
                   </Step>
               ))}
            </Stepper>
        </div>
    )
};

export default memo(StepperProgress)