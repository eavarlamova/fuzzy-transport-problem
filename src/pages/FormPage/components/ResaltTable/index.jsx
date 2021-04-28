import { Table, TableHead, TableCell, TableBody, TableRow } from "@material-ui/core";
import { memo } from "react";

const ResultTable = (props) => {
  const {
    points,
    matrix,
  } = props;

  return (
    <>

      <Table>
        {/* <TableHead> */}
          <TableRow>
            <TableCell>ПО/ПН</TableCell>
            {points.destination.map(({ name, quality }) => (
              <TableCell> {name} - {quality} </TableCell>
            )) || ''}
          </TableRow>
        {/* </TableHead>
        <TableBody> */}
          {console.log('#######', matrix, '#######')}
          {matrix.map((item, index) => {
            return (
              <TableRow>
                <TableCell> {points.departure[index].name}</TableCell>
                {item.map(item => <TableCell> {item.x}</TableCell> )}
                {/* <TableCell> </TableCell> */}
              </TableRow>
            )
          })}
          {/* <TableRow>
            <TableCell>

            </TableCell>
          </TableRow> */}
        {/* </TableBody> */}
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
