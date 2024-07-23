import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, _file, cb) {
    cb(null, "./public/temp"); // Setting the destination for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Using the original file name
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limiting file size to 5MB
}).fields([
  { name: "avatar", maxCount: 1 }, // Expecting a single avatar file
  { name: "coverImg", maxCount: 1 } // Expecting a single cover image file
]);
