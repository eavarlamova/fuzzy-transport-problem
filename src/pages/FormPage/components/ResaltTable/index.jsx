import { Table, TableHead, TableCell, TableBody, TableRow, Input, Tooltip } from "@material-ui/core";
import { HighlightOffSharp } from "@material-ui/icons";
import { memo } from "react";
import "../../index.scss"
const ResultTable = (props) => {
  const {
    points,
    matrix,
    handleChangePrice,
    name,
    deletePoint,
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
          {console.log('matrix', matrix)}
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
                            <Input
                              value={typeof (item.c) === 'number' ? item.c : ''}
                              onChange={({ target: { value } }) => { handleChangePrice(indexRow, indexCol, value) }}
                              placeholder={`введите ${name} перевозки 1единицы`}
                            />
                          </Tooltip>
                          :
                          item.x
                      }
                    </TableCell>


                  ))}
                  <TableCell className="table_quality">
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
          </TableRow>
          {/* <TableRow>
            <TableCell>

            </TableCell>
          </TableRow> */}
        </TableBody>
      </Table>
      {/*       
      {
        points.destination.map(({ name, quality }) => (
          <li> {name} - {quality} </li>
        )) || ''
      } */}
    </>
  )
};

export default memo(ResultTable);
