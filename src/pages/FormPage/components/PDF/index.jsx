import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import { Button } from "@material-ui/core";
import { memo, useMemo } from "react";
import { getDataFromLS } from "../../../../helpers/localStorage";

const PDF = ({ matrix, points, fuzzyDataControl,firstTotalCosts }) => {

  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const getSum = (array) => (
    array.reduce((acc, { quality }) => (acc = acc + Number(quality)), 0)
  )
  const getTable = (currentMatrix = matrix, key ='c') => {

    // формирование первой строки таблицы
    // формирование последней строки таблицы
    const firstRow = [{ text: `ПО \\ ПН`, bold: true }];
    const lastRow = [{ text: `ЗАЯВКИ`, bold: true }]
    points.destination
      &&
      points.destination.forEach(({ name, quality }, index) => {
        firstRow.push({ text: name, bold: true })
        lastRow.push({ text: quality })
      })
    firstRow.push({ text: `ЗАПАСЫ`, bold: true })
    lastRow.push({ text: `${getSum(points.departure)} = ${getSum(points.destination)}` })

    // тело таблицы
    const bodyRows = currentMatrix.map((row, indexRow) => {
      const newRow = row.map((col, indexCol) => {
        return { text: col[key] }
      })

      return [
        { text: `${points.departure[indexRow].name}`, bold: true },
        ...newRow,
        { text: `${points.departure[indexRow].quality}` },
      ];
    })





    return [firstRow, ...bodyRows, lastRow];

  }

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
      {
        text: `Исходная таблица со стоимостями одной перевозки между пунктами:`,
        bold: true,
        fontSize: 20,
        margin: [30, 0, 0, 30],
      },
      {
        layout: 'lightHorizontalLines', // optional
        table: {
          headerRows: 1,
          widths: colWidths,

          body:
            getTable(),
        },
        pageBreak: 'after',
      },


      // опорный план + затртаты (без оптимизации)
      {
        text: `Базовый опорный план:`,
        bold: true,
        fontSize: 20,
        margin: [30, 0, 0, 30],
      },
      {
        layout: 'lightHorizontalLines', // optional
        table: {
          headerRows: 1,
          widths: colWidths,

          body:
            getTable(matrix, 'x'),
        },
      },
      {
        text: `Общие затраты по данному опорному плану - ${firstTotalCosts}`,
        margin: [30, 20, 0, 0],
        bold: true,
        pageBreak: 'after',
      }

      // оптимизированный план + затртаы (с оптимизаций)

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