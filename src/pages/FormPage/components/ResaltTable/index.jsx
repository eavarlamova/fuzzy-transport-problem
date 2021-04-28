import { Table, TableHead, TableCell, TableBody, TableRow, Input } from "@material-ui/core";
import { memo } from "react";
import "../../index.scss"
const ResultTable = (props) => {
  const {
    points,
    matrix,
    handleChangePrice,
  } = props;

  return (
    <>

      <Table className='table'>
        <TableHead>
          <TableRow>
            <TableCell>ПО\ПН</TableCell>
            {points.destination.map(({ name, quality }) => (
              <TableCell className='table_name'> {name} </TableCell>
            )) || ''}
          </TableRow>
        </TableHead>
        <TableBody>
          {console.log('matrix', matrix)}
          {matrix.map((item, indexRow) => {
            return (
              <TableRow>
                <TableCell className='table_name'> {points.departure[indexRow].name}</TableCell>
                {item.map((item, indexCol) => (
                  <TableCell>
                    <Input 
                      value={typeof(item.c)==='number' ? item.c : ''}
                      onChange={({target: {value}})=>{handleChangePrice(indexRow,indexCol,value)}}
                    />
                  </TableCell>
                ))}
                {/* <TableCell> </TableCell> */}
              </TableRow>
            )
          })}
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
