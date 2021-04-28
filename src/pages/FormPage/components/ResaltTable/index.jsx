import { Table, TableHead, TableCell, TableBody, TableRow } from "@material-ui/core";
import { memo } from "react";
import "../../index.scss"
const ResultTable = (props) => {
  const {
    points,
    matrix,
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
          {console.log('#######', matrix, '#######')}
          {matrix.map((item, index) => {
            return (
              <TableRow>
                <TableCell className='table_name'> {points.departure[index].name}</TableCell>
                {item.map(item => <TableCell> {item.x}</TableCell> )}
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
