import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import { Button } from "@material-ui/core";
import { memo, useMemo, useEffect } from "react";
import { getDataFromLS } from "../../../../helpers/localStorage";
import * as htmlToImage from 'html-to-image';

const PDF = ({
  matrix,
  points,
  fuzzyDataControl,
  firstTotalCosts,
  optimizedMatrixValue,
  firstDeviation,
  optimizedMatrixFullCosts,
  image,
}) => {
  let imageForPDF = '';
  // useEffect(()=>{
  // getImgGraph()
  // },[matrix])
  // const getImgGraph = async () => {
  //   let img = null;
  //   try {
  //     // создание имг из графа
  //     const pathForGraph = document.getElementById('chart-my')
  //     const ima_url = await htmlToImage.toPng(pathForGraph)
  //     img = new Image();
  //     // img.src = ima_url;
  //     // document.body.appendChild(img);
  //     // .then(function (dataUrl) {
  //     //   var img = new Image();
  //     //   img.src = dataUrl;
  //     //   document.body.appendChild(img);
  //     // })
  //     // .catch(function (error) {
  //     //   console.error('oops, something went wrong!', error);
  //     // });
  //     // console.log('img', img)
  //     // console.log('ima_url', ima_url)
  //     imageForPDF = ima_url
  //     return ima_url;
  //   }
  //   catch (err) {
  //     console.error('ОШИБКА С ГЕНЕРАЦИЕЙ КАРТИНКИ')
  //   }

  // }

  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const getSum = (array) => (
    array.reduce((acc, { quality }) => (acc = acc + Number(quality)), 0)
  )
  const getTable = (currentMatrix = matrix, key = 'c') => {

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
        if (fuzzyDataControl && key === 'c') {
          return {
            text: `${col.cMin};
                   ${col.c};
                   ${col.cMax};`
          }
        }
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
    // console.log('points', points.destination)
    return [
      ...points.destination.map(() => '*'),
      '*',
      '*'
    ]
  }, [points])

  const colLength = useMemo(() => (
    points.destination.length
  ), [points])



  const getDocumentContent = (pageSize = 'A4', img_url) => {
    // console.log('imageForPDF', imageForPDF)
    if(fuzzyDataControl){
    return (
      {
        info: {
          title: 'Результат оптимизации в формате PDF',
          author: 'Екатерина Варламова',
          subject: 'SS-method for fuzzy-data',
          keywords: 'stepping-stone, fuzzy-data, нечеткие данные, оптимизация'
        },
        // больше 10 столбцов(в) - надо делать формат а3
        pageSize: pageSize,
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
            text: `${fuzzyDataControl
              ?
              'так как для анализа были предоставлены нечеткие данные, в таблице находятся три значения - минимальное, среднее, максимальное'
              :
              ''}`,
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
            text: `Общие затраты по данному опорному плану - ${firstTotalCosts}
          ${fuzzyDataControl
                ?
                `Величина отклонения по данному опорному плану - ${firstDeviation}`
                :
                ''}
              `,
            margin: [30, 20, 0, 0],
            bold: true,
            pageBreak: 'after',
          },


          // оптимизированный план + затртаы (с оптимизаций)
          {
            text: `Оптимизированный опорный план:`,
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
                getTable(optimizedMatrixValue.matrix, 'x'),
            },
          },
          {
            text: `Общие затраты по данному опорному плану - ${fuzzyDataControl ? optimizedMatrixFullCosts : optimizedMatrixValue.costs}
          ${fuzzyDataControl
                ?
                `Величина отклонения по данному опорному плану - ${optimizedMatrixValue.costs}`
                :
                ''}
            `,
            margin: [30, 20, 0, 0],
            bold: true,
            pageBreak: 'after',
          },

          {
            image: img_url,
            width: 780,
            // pageBreak: 'before',

            // height: 500,
          },


          // комментарии к  документу
          {
            text: `ВНИМАНИЕ!`,
            bold: true,
            fontSize: 20,
            alignment: 'center',
            pageBreak: 'before',
          },
          {
            text: `формат данного документы - ${pageSize}.
        обратите внимание на это при печати`
          }
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
    )
  }
  else {
    return (
      {
        info: {
          title: 'Результат оптимизации в формате PDF',
          author: 'Екатерина Варламова',
          subject: 'SS-method for fuzzy-data',
          keywords: 'stepping-stone, fuzzy-data, нечеткие данные, оптимизация'
        },
        // больше 10 столбцов(в) - надо делать формат а3
        pageSize: pageSize,
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
            text: `${fuzzyDataControl
              ?
              'так как для анализа были предоставлены нечеткие данные, в таблице находятся три значения - минимальное, среднее, максимальное'
              :
              ''}`,
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
            text: `Общие затраты по данному опорному плану - ${firstTotalCosts}
          ${fuzzyDataControl
                ?
                `Величина отклонения по данному опорному плану - ${firstDeviation}`
                :
                ''}
              `,
            margin: [30, 20, 0, 0],
            bold: true,
            pageBreak: 'after',
          },


          // оптимизированный план + затртаы (с оптимизаций)
          {
            text: `Оптимизированный опорный план:`,
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
                getTable(optimizedMatrixValue.matrix, 'x'),
            },
          },
          {
            text: `Общие затраты по данному опорному плану - ${fuzzyDataControl ? optimizedMatrixFullCosts : optimizedMatrixValue.costs}
          ${fuzzyDataControl
                ?
                `Величина отклонения по данному опорному плану - ${optimizedMatrixValue.costs}`
                :
                ''}
            `,
            margin: [30, 20, 0, 0],
            bold: true,
          },



          // комментарии к  документу
          {
            text: `ВНИМАНИЕ!`,
            bold: true,
            fontSize: 20,
            alignment: 'center',
            pageBreak: 'before',
          },
          {
            text: `формат данного документы - ${pageSize}.
        обратите внимание на это при печати`
          }
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
    )
  }

  }
  const openPDF = async () => {
    // 10 - а4
    // 15 - a3 15/5 =3
    // 20 - a2 20/2 =10/5=2
    // 25 - a1 25/5 =5 /5 =1  
    const pathForGraph = document.getElementById('chart-my')
    if(fuzzyDataControl) {
      const img_url = await htmlToImage.toPng(pathForGraph)
      const pageSize = colLength < 11 ? 'A4' : 'A3';
      pdfMake.createPdf(getDocumentContent(pageSize, img_url)).open()
    }
    else{
      const pageSize = colLength < 11 ? 'A4' : 'A3';
      pdfMake.createPdf(getDocumentContent(pageSize)).open()
    }
  };

  const downloadPDF = async () => {
    const pathForGraph = document.getElementById('chart-my')
    const img_url = await htmlToImage.toPng(pathForGraph)

    const pageSize = colLength < 11 ? 'A4' : 'A3';
    pdfMake.createPdf(getDocumentContent(pageSize, img_url)).download('SS-optimizetion.pdf')
  }

  return (
    <>
      <Button
        onClick={openPDF}
        fullWidth
        color='secondary'
        variant="outlined"
      >
        смотреть pdf
        </Button>

      <Button
        onClick={downloadPDF}
        fullWidth
        color='secondary'
        variant='contained'
      >
        скачать pdf
        </Button>

    </>
  )
}

export default memo(PDF);