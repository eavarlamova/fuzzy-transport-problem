import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import { Button } from "@material-ui/core";
import { memo, useMemo } from "react";
import { getDataFromLS } from "../../../../helpers/localStorage";

const PDF = ({ matrix, points, fuzzyDataControl }) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const getSum = (array) => (
    array.reduce((acc, { quality }) => (acc = acc + Number(quality)), 0)
  )
  const getTable = (currentMatrix = matrix) => {

    // формирование первой строки таблицы
    // формирование последней строки таблицы
    const firstRow = [{ text: `ПО \\ ПН`, bold: true }];
    const lastRow = [{ text: `ЗАЯВКИ`, bold: true }]
    points.destination
      &&
      points.destination.forEach(({ name, quality }, index) => {
        firstRow.push({ text: name, bold: true })
        lastRow.push({ text: quality})
      })
    firstRow.push({ text: `ЗАПАСЫ`, bold: true })
    lastRow.push({ text: `${getSum(points.departure)} = ${getSum(points.destination)}` })
    
    // тело таблицы
    const bodyRows = currentMatrix.map((row, indexRow) => {
      const newRow = row.map((col, indexCol) => {
        // console.log('col.x', col.x)
        return { text: col.c }
      })

      return [
        { text: `${points.departure[indexRow].name}`, bold: true },
        ...newRow,
        { text: `${points.departure[indexRow].quality}` },
      ];
    })




    //   <TableBody>
    //     {matrix.map((item, indexRow) => {
    //       return (
    //         <>
    //           <TableRow>
    //             <TableCell className='table_name'>
    //               {
    //                 deletePoint
    //                   ?
    //                   <HighlightOffSharp
    //                     className="table_delete-icon"
    //                     onClick={() => deletePoint('departure', indexRow)}
    //                   />
    //                   :
    //                   ''
    //               }
    //               {points.departure[indexRow].name}
    //             </TableCell>
    //             {item.map((item, indexCol) => (

    //               <TableCell>
    //                 {
    //                   name === 'стоимость'
    //                     ?
    //                     <Tooltip
    //                       title={`${name} перевозки единицы товара 
    //                       из ${points.departure[indexRow].name} 
    //                       в ${points.destination[indexCol].name}`}
    //                     >
    //                       {
    //                         fuzzyDataControl ?
    //                           <>
    //                             <Input
    //                               value={typeof (item.cMin) === 'number' ? item.cMin : ''}
    //                               onChange={({ target: { value } }) => { handleChangePrice(indexRow, indexCol, value, 'cMin') }}
    //                               placeholder={`введите min ${name} перевозки 1единицы`}
    //                             />
    //                             <Input
    //                               value={typeof (item.c) === 'number' ? item.c : ''}
    //                               onChange={({ target: { value } }) => { handleChangePrice(indexRow, indexCol, value) }}
    //                               placeholder={`введите сред. ${name} перевозки 1единицы`} />
    //                             <Input
    //                               value={typeof (item.cMax) === 'number' ? item.cMax : ''}
    //                               onChange={({ target: { value } }) => { handleChangePrice(indexRow, indexCol, value, 'cMax') }}
    //                               placeholder={`введите max ${name} перевозки 1единицы`} />
    //                           </>
    //                           :
    //                           <Input
    //                             value={typeof (item.c) === 'number' ? item.c : ''}
    //                             onChange={({ target: { value } }) => { handleChangePrice(indexRow, indexCol, value) }}
    //                             placeholder={`введите ${name} перевозки 1единицы`}
    //                           />
    //                       }

    //                     </Tooltip>
    //                     :
    //                     item.x
    //                 }
    //               </TableCell>


    //             ))}
    //             <TableCell className="table_quality" >
    //               {points.departure[indexRow].quality}
    //             </TableCell>
    //           </TableRow>

    //         </>
    //       )
    //     })}
    //     <TableRow>
    //       <TableCell>
    //         ЗАЯВКА <br /> b<sub>j</sub>
    //       </TableCell>
    //       {points.destination.map(item => <TableCell className="table_quality" >{item.quality}</TableCell>)}
    //       <TableCell>
    //         {points.departure.reduce((acc, item) => (acc = acc + Number(item.quality)), 0)}
    //         =
    //         {points.destination.reduce((acc, item) => (acc = acc + Number(item.quality)), 0)}
    //       </TableCell>
    //     </TableRow>
    //   </TableBody>
    // </Table >
    // console.log(' [firstRow, bodyRows]',  [firstRow, bodyRows])
    return [firstRow, ...bodyRows, lastRow];

  }
  // const getWidths = () => {
  //   const countLength = points.destination.length + 1;


  // }
  const colWidths = useMemo(() => {
    console.log('points', points.destination)
    return [
      ...points.destination.map(() => '*'),
      '*',
      '*'
    ]
  }, [points])

  const documentContent = {
    info: {
      title: 'Результат оптимизации в формате PDF',
      author: 'Екатерина Варламова',
      subject: 'SS-method for fuzzy-data',
      keywords: 'stepping-stone, fuzzy-data, нечеткие данные, оптимизация'
    },

    pageSize: 'A4',
    pageOrientation: 'landscape', //'portrait'
    pageMargins: [50, 50, 50, 50],

    // header: [
    //   {
    //     text: 'внимание'
    //   },
    // ],

    content: [
      // титульный лист
      {
        text: `
          Отчет об оптимизации задачи 
          с ${fuzzyDataControl ? 'нечеткими' : 'четкими'} данными 
          методом stepping-stone`,
        fontSize: 40,
        alignment: 'center'
        // margin: [40, 10, 20, 0]
        // 		'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'

      },
      {
        text: `исходный код данного приложения Вы сможете найти по ссылке:`,
        alignment: 'center',

        margin: [0, 50, 0, 30]

      },
      {
        qr: 'https://github.com/eavarlamova/fuzzy-transport-problem',
        fit: '100',
        alignment: 'center',
        pageBreak: 'after'
      },



      // исходные данные 
      // опорный план + затртаты (без оптимизации)
      // оптимизированный план + затртаы (с оптимизаций)


      {
        layout: 'lightHorizontalLines', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: colWidths,

          body:
            getTable(),
          // ['dsd', 'Second', 'Third', 'The last one'],
          // ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
          // [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4']

        }
      },




    ],


    footer: function (currentPage, pageCount) {
      return {
        text: [
          { text: `${currentPage.toString()} из ${pageCount} страниц` },
          //  { text: `спасибо за использование `}, 
        ],
        // },
        alignment: 'right',
        margin: [0, 0, 50, 0]
      }
    },

  }
  const openPDF = () => {
    pdfMake.createPdf(documentContent).open()
  };



  return (
    <>
      <Button onClick={openPDF}>
        получить пдф
        </Button>


    </>
  )
}

export default memo(PDF);