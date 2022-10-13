import express from "express";

import homeController from "../controller/homeController"

import multer from 'multer'

import path from 'path'

import appRoot from 'app-root-path'

//userController
import userController from "../controller/UserController"
let router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + "/src/public/image/");
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter })
let uploadMultipleFiles = multer({ storage: storage, fileFilter: imageFilter }).array('multiple_images', 3);
const initWebRouter = (app) => {
    router.get('/', homeController.getHomepage);

    router.get('/detail/user/:userId', homeController.getDetailpage)

    router.post('/create-user-new', homeController.createNewUser)

    router.get('/edit-user/:id', homeController.getEditUser)

    router.post('/delete-user', homeController.deleteUser)

    router.post('/update-user', homeController.updateUser)

    router.get('/upload', homeController.getUploadFile)
    router.post('/upload-profile-pic', upload.single('profile_pic'), homeController.handleUploadFile)
    router.post('/upload-multiple-images', (req, res, next) => {
        uploadMultipleFiles(req, res, (err) => {
            if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
                res.send('ĐÃ VƯỢT QUÁ GIỚI HẠN CHO PHÉP')
            } else if (err) {
                res.send(err)
            }
            else {
                next()
            }
        })
    }, homeController.handleUploadMultipleFile)


    // router.get('/findone', userController.findOneEmail)
    router.get('/phong', (req, res) => {
        res.send('Mình là Phong')
    })

    return app.use('/', router)
}

export default initWebRouter