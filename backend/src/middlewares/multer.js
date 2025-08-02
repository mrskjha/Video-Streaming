import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, _file, cb) {
    cb(null, "./public/temp"); // Setting the destination for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Using the original file name
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 150 }, 
});

export default upload;

