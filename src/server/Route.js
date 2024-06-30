const multer = require("multer");

// apis
const fetchDirInfoApi = require("./api/FetchDirInfo");
const fetchSysInfoApi = require("./api/FetchSysInfo");
const fetchZipInfoApi = require("./api/FetchZipInfo");
const getDataUrlApi = require("./api/GetDataUrl");
const getStarredApi = require("./api/GetStarred");
const addStarredApi = require("./api/AddStarred");
const deleteStarredApi = require("./api/DeleteStarred");
const getFileDataApi = require("./api/GetFileData");
const getFileContentApi = require("./api/GetFileContent");
const saveFileContentApi = require("./api/SaveFileContent");
const deleteFileApi = require("./api/DeleteFile");
const uploadFileApi = require("./api/UploadFile");
const renameFileApi = require("./api/RenameFile");
const createFileApi = require("./api/CreateFile");
const createDirApi = require("./api/CreateDir");
const setPasswordApi = require("./api/SetPassword");
const setConfigApi = require("./api/SetConfig");
const getConfigApi = require("./api/GetConfig");
const moveApi = require("./api/Move");

module.exports = function(app) {
    app.get("/fetchDirInfo", (req, res) => fetchDirInfoApi(req, res));
    app.get("/fetchSysInfo", (req, res) => fetchSysInfoApi(req, res));
    app.get("/fetchZipInfo", (req, res) => fetchZipInfoApi(req, res));
    app.get("/getDataUrl", (req, res) => getDataUrlApi(req, res));
    app.get("/getStarred", (req, res) => getStarredApi(req, res));
    app.post("/addStarred", (req, res) => addStarredApi(req, res));
    app.post("/deleteStarred", (req, res) => deleteStarredApi(req, res));
    app.get("/getFileData", (req, res) => getFileDataApi(req, res));
    app.get("/getFileContent", (req, res) => getFileContentApi(req, res));
    app.post("/saveFileContent", (req, res) => saveFileContentApi(req, res));
    app.post("/deleteFile", (req, res) => deleteFileApi(req, res));
    app.post("/uploadFile", multer({dest: "upload_tmp/"}).any(), (req, res) => uploadFileApi(req, res));
    app.post("/renameFile", (req, res) => renameFileApi(req, res));
    app.post("/createFile", (req, res) => createFileApi(req, res));
    app.post("/createDir", (req, res) => createDirApi(req, res));
    app.post("/setPassword", (req, res) => setPasswordApi(req, res));
    app.post("/setConfig", (req, res) => setConfigApi(req, res));
    app.get("/getConfig", (req, res) => getConfigApi(req, res));
    app.post("/move", (req, res) => moveApi(req, res));

    return app;
};
