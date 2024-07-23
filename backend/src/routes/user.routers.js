import express from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelsDetails, getWatchHistory, loginUser, logoutUser, registerUser, updateAccountDetails, updateUserAvatar } from "../controllers/users.controllers.js";
import {upload} from "../middlewares/multer.js";

import { verifyJWT } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register",upload, registerUser);

router.route("/login").post(loginUser);


//secured routes
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/changePassword").post(verifyJWT,changeCurrentPassword);
router.route("/current-user").get(verifyJWT,getCurrentUser);
router.route("/update-account").put(verifyJWT,updateAccountDetails);

router.route("/avatar").patch(verifyJWT,upload,updateUserAvatar);

// router.route("/cover-img").patch(verifyJWT,upload.single("Cover-img"),updateUserCoverImg);

router.route("/c/:username").get(verifyJWT,getUserChannelsDetails);

router.route("/history").get(verifyJWT,getWatchHistory);

export default router;

