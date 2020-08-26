import Excel from 'exceljs';
import fs from 'fs';
import { save  } from '../utils/helpers';

// convert function
exports.index = (req, res) => {
    const {files} = req;
    const uploads_folder = process.env.UPLOAD_PATH;
    const data = [];
    const dataM = [];
    const dataF = [];
    const array_accept = ["xlsx", "xls","csv"];
    let col_number = 0;

    // there i'm try to create directory where file will be save after uploading
    if (!fs.existsSync(uploads_folder)){
        console.log("create ", uploads_folder, "folder")
        const folders = uploads_folder.split("/")
        let folder_to_create = "";
        console.log(folders)
        for(let i =1; i<folders.length - 1; i++){
            const folder = folders[i];
            if(folder !== "" || folder !== "."){
                folder_to_create = folder_to_create + folder + "/";
            }
            console.log(folder_to_create)
            if (!fs.existsSync(folder_to_create))fs.mkdirSync(folder_to_create);
        }
    }

    if (!files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    const myFile = files.file;
    const current_extension = myFile.name.split('.')[1]
    if (!array_accept.includes(current_extension)) {
        return res.status(500).send({ msg: "file not supported, it must be XLSX or XLS" })
    }
    const filePath = uploads_folder+myFile.name
    myFile.mv(`${uploads_folder}${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ 
                msg: "Error occured",
                error: err
            });
        }
        console.log("file is uploaded correctly !!!")
    });

    let name = myFile.name.split('.')[0];
    let sheet = 0;

    if(req.body.sheet) sheet = req.body.sheet;
    if(req.body.name) name = req.body.name;
    let workbook = new Excel.Workbook();
    console.log("");
    console.log("start reading >>>>>>");
    try{
        workbook.csv.readFile(filePath).then(function () {
            let worksheet = workbook.worksheets[sheet];
            worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
                const line = [];

                row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
                    if(rowNumber === 1){
                        let a= { header: cell.value, key: cell.value };
                        line.push(a);
                        
                        col_number++;
                    }else{
                        if(colNumber <= col_number){
                            let val = cell.value;
                           
                            line.push(val);
    
                        }
                    }
                });
                console.log("line gender:",line[4])
                if(rowNumber === 1){
                    let a={ header: "full_name", key: "full_name" };
                    line.push(a);
                    dataF.push(line);
                    dataM.push(line);


                }else{
                line.push(line[1]+" "+line[2]);
            }

                if (line[4]=="Female") {

                    dataF.push(line);

                }else if (line[4]=="Male") {
                    dataM.push(line);

                }
                data.push(line);
            });
            
            console.log("file was read successfull >>>>>>");
            
            save(dataF,"females")
            save(dataM,"males")

            

            
    
            res.send({
                message: `you are on the converter url !!!`,
                dataF: dataF,
                dataM: dataM,
                data: data,
                count: data.length,
                table_name: name
            });
        });
    } catch(e){
        res.send({
            message: e
        });
    }
};