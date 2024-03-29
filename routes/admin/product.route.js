const express = require("express");
const multer = require("multer");
const router = express.Router();
// const storageMulter = require("../../helpers/storageMulter")

const upload = multer();
const controller=require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate")

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);


router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);// tra ve giao dien

router.post(
    "/create", 
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);
router.get("/edit/:id", controller.edit);// tra ve giao dien

router.patch(
    "/edit/:id", 
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,//validate giong nhau
    controller.editPatch);

router.get("/detail/:id", controller.detail);// tra ve giao dien

module.exports=router;