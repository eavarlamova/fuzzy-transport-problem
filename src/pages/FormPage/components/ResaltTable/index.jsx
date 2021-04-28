import { Table, TableHead, TableCell, TableBody } from "@material-ui/core";
import { memo } from "react";

const ResultTable = (props) => {
  const {
    points
  } = props;

  return (
    <>

      <Table>
        <TableHead>
          <TableCell>ПО/ПН</TableCell>
          {points.destination.map(({ name, quality }) => (
            <TableCell> {name} - {quality} </TableCell>
          )) || ''}
        </TableHead>
        <TableBody></TableBody>
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
