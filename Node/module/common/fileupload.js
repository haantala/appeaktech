const path = require("path");
const ResponseHelper = require("../../Helper/ResponseHelper");

const fileUploadFunction = (files) => {
  try {
    const singleFileRecord = files;
    singleFileRecord.mv(
      path.join(__dirname, `../../media`, singleFileRecord.name),
      (error) => {
        if (error) {
          console.log(
            "==========ERROR FROM Common Function FileUploaderFunction ============ "
          );
          console.log(error);
          return ResponseHelper.serviceToController(2, [], "File Upload Error");
        }
      }
    );
    return ResponseHelper.serviceToController(
      1,
      singleFileRecord,
      "Uploaded File Response"
    );
  } catch (error) {
    console.log(
      "====================== ERROR FROM fileUploadFunction CONTROLLER ======================"
    );
    console.log(error);
    return ResponseHelper.serviceToController(
      4,
      [],
      "Something Went Wrong Please Try Again"
    );
  }
};

// const deleteFilesCommanFun = (foldername, filenames) => {
//   const folder = path.join(__dirname, `../../public/assets/${foldername}`);

//   if (!fs.existsSync(folder)) {
//     console.error(`Folder ${folder} does not exist.`);
//     return;
//   }

//   const deletedFiles = [];

//   for (let i = 0; i < filenames.length; i++) {
//     const filepath = path.join(folder, filenames[i]);

//     // Check if the file exists before attempting to unlink
//     if (fs.existsSync(filepath)) {
//       fs.unlinkSync(filepath);
//       deletedFiles.push(filenames[i]);
//     }
//   }

//   return deletedFiles;
// };

module.exports = {
  fileUploadFunction,
  // deleteFilesCommanFun,
};
