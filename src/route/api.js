import express from "express";

import APIController from "../controller/APIController"
import UserController from "../controller/UserController"
import CartController from '../controller/CartController'
import MailController from "../controller/MailController"
import OrderController from "../controller/OrderController"
let router = express.Router();
import path from 'path'
import auth from '../middleware/auth'
import multer from 'multer'
import appRoot from 'app-root-path'
const storage = multer.diskStorage({
    destination: "./src/public/image/",
    filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
});

const upload = multer({
    storage: storage
})

const storageMobile = multer.diskStorage({
    destination: "./src/public/image/",
    filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname) + '.jpg')
});

const uploadMobile = multer({
    storage: storageMobile
})
const initAPIRoute = (app) => {

    router.post('/admin/createcategory', uploadMobile.single('logo'), APIController.createNewCategory)

    router.get('/account/info', UserController.getInfo)
    //Đăng ký tài khoản
    router.post('/account/signup', uploadMobile.single('avatar'), UserController.createNewUser)

    //login
    router.post('/login', APIController.handleLogin)

    //Đổi mật khẩu
    router.post('/changepassword', UserController.changePassword)

    //Quên mật khẩu 
    router.post('/forgot-password', MailController.forgotPassword)

    //Xác nhận mã xác minh
    router.post('/confirm/:id_account', MailController.confirm)

    //Danh sách danh mục
    router.get('/category?:id', APIController.getCategory)

    //Trả về toàn bộ sản phẩm
    router.get('/product', APIController.getProduct)

    //Thêm sản phẩm
    router.post('/createNewProduct', upload.single('images'), APIController.createNewProduct)

    //update sản phẩm
    router.put('/updateProduct/:id_product', APIController.updateProduct)

    //Xóa sản phẩm
    router.delete('/deleteProduct/:id_product', APIController.deleteProduct)

    //Thêm vào giỏ hàng
    router.post('/product/:id_product', auth.authenUser, CartController.addProduct)

    //Xóa sản phẩm trong giỏ hàng
    router.delete('/product/:id_product', auth.authenUser, CartController.deleteProductFromCart)

    //Xem danh sách sản phẩm trong giỏ hàng
    router.post('/account', auth.authenUser, CartController.getCart)

    //Xem đon đặt hàng
    router.get('/order', auth.authenUser, OrderController.getOrder)

    //Xem chi tiết đơn đặt hàng
    router.get('/detailOrder/:id_order', OrderController.getDetailOrder)

    //Thanh toán 
    router.post('/pay', auth.authenUser, CartController.pay)

    //Sửa thông tin cá nhân 
    router.post('/modified/:id_account', auth.authenUser, UserController.updateInfo)

    router.post('/search', UserController.searchProduct)

    //---------------Admin----------------------------
    //Lấy tất cả danh sách tài khoản khách hàng
    router.get('/admin/account', auth.authenAdmin, UserController.listAccount)
    router.post('/admin/category', auth.authenAdmin, APIController.createNewCategory)
    router.get('/admin/getcategory', auth.authenAdmin, APIController.getCategory)
    router.get('/detailProduct', APIController.getDetailProduct)
    router.post('/admin/createNewProduct', auth.authenAdmin, APIController.createNewProduct)
    return app.use('/api/v1/', router)
}

export default initAPIRoute