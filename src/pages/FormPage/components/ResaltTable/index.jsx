import { memo } from "react";
import { HighlightOffSharp } from "@material-ui/icons";
import { 
  Input, 
  Table, 
  Tooltip,
  TableRow, 
  TableBody, 
  TableHead, 
  TableCell, 
 } from "@material-ui/core";
import "../../index.scss"

const ResultTable = (props) => {
  const {
    points,
    matrix,
    handleChangePrice,
    name,
    deletePoint,
    fuzzyDataControl,
  } = props;

  return (
    <>

      <Table className='table'>
        <TableHead>
          <TableRow>
            <TableCell>ПО\ПН</TableCell>
            {points.destination.map(({ name, quality }, index) => (
              <TableCell className='table_name'>
                {
                  deletePoint
                    ?
                    <HighlightOffSharp
                      className="table_delete-icon"
                      onClick={() => deletePoint('destination', index)}
                    />
                    :
                    ''
                }
                {name}
              </TableCell>
            )) || ''}
            <TableCell> ЗАПАСЫ <br /> a<sub>i</sub> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {matrix.map((item, indexRow) => {
            return (
              <>
                <TableRow>
                  <TableCell className='table_name'>
                    {
                      deletePoint
                        ?
                        <HighlightOffSharp
                          className="table_delete-icon"
                          onClick={() => deletePoint('departure', indexRow)}
                        />
                        :
                        ''
                    }
                    {points.departure[indexRow].name}
                  </TableCell>
                  {item.map((item, indexCol) => (

                    <TableCell>
                      {
                        name === 'стоимость'
                          ?
                          <Tooltip
                            title={`${name} перевозки единицы товара 
                            из ${points.departure[indexRow].name} 
                            в ${points.destination[indexCol].name}`}
                          >
                            {
                              fuzzyDataControl ?
                                <>
                                  <Input
                                    value={typeof (item.cMin) === 'number' ? item.cMin : ''}
                                    onChange={({ target: { value } }) => { handleChangePrice(indexRow, indexCol, value, 'cMin') }}
                                    placeholder={`введите min ${name} перевозки 1единицы`}
                                  />
                                  <Input
                                    value={typeof (item.c) === 'number' ? item.c : ''}
                                    onChange={({ target: { value } }) => { handleChangePrice(indexRow, indexCol, value) }}
                                    placeholder={`введите сред. ${name} перевозки 1единицы`} />
                                  <Input
                                    value={typeof (item.cMax) === 'number' ? item.cMax : ''}
                                    onChange={({ target: { value } }) => { handleChangePrice(indexRow, indexCol, value, 'cMax') }}
                                    placeholder={`введите max ${name} перевозки 1единицы`} />
                                </>
                                :
                                <Input
                                  value={typeof (item.c) === 'number' ? item.c : ''}
                                  onChange={({ target: { value } }) => { handleChangePrice(indexRow, indexCol, value) }}
                                  placeholder={`введите ${name} перевозки 1единицы`}
                                />
                            }
                          </Tooltip>
                          :
                          item.x
                      }
                    </TableCell>
                  ))}
                  <TableCell className="table_quality" >
                    {points.departure[indexRow].quality}
                  </TableCell>
                </TableRow>

              </>
            )
          })}
          <TableRow>
            <TableCell>
              ЗАЯВКА <br /> b<sub>j</sub>
            </TableCell>
            {points.destination.map(item => <TableCell className="table_quality" >{item.quality}</TableCell>)}
            <TableCell>
              {points.departure.reduce((acc,item)=>(acc=acc+Number(item.quality)),0)}
              =
              {points.destination.reduce((acc,item)=>(acc=acc+Number(item.quality)),0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
};

export default memo(ResultTable);
