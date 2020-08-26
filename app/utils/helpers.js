import Excel from 'exceljs'
// save files
const save = (data, name) => {

  // Create workbook & add worksheet
  const wkbook = new Excel.Workbook();
  const wksheet = wkbook.addWorksheet('ExampleSheet');
  // Change Columns position 

  data = data.map(function (x) {
    return [x[0], x[1], x[2], x[7], x[3], x[4], x[5], x[6]];
  });
  // add column headers
  wksheet.columns = data[0];
  // Delete first entry
  data.shift();
  //Sorting with age
  data = data.sort(function (a, b) { return a[7].valueOf() - b[7].valueOf(); });

  // Add rows using both the above of rows
  const rows = data;

  wksheet
    .addRows(rows);

  // save workbook to disk
  wkbook
    .csv
    .writeFile(name + '.csv')
    .then(() => {
      console.log("saved");
    })
    .catch((err) => {
      console.log("err", err);
    });

  return data;
}

export {
  save,
};