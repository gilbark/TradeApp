const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = null;
    console.log(file.mimetype);
    if (file.size > 5000000) {
      error = new Error("File is too big");
      console.log("too big");
    }

    if (!isValid) {
      error = new Error("Invalid mime type");
      console.log("wrong type");
    }
    console.log("error is" + error);
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});
module.exports = multer({ storage: storage }).array("images[]", 5);
