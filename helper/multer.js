const multer = require("multer");

exports.multipleUpload = (path) => {
    try {
        const storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, `InventoryImage/${path}/`);
            },
            filename: function (req, file, cb) {
                cb(null, `${Date.now()}.${file.originalname.split('.').slice(-1)[0]}`)
            }
        });
        return multer({ storage: storage }).array('files');
    } catch (err) {
        console.log("err: ", err);
    }
}

exports.singleUpload = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, __dirname);
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}.${file.originalname.split('.').slice(-1)[0]}`)
        }
    });
    return multer({ storage: storage }).single('avtar');
}
