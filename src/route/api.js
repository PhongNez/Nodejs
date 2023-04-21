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
    storage: storage
})
const initAPIRoute = (app) => {


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

    //Thêm vào giỏ hàng
    router.post('/product/:id_product', auth.authenUser, CartController.addProduct)

    //Xóa sản phẩm trong giỏ hàng
    router.delete('/product/:id_product', auth.authenUser, CartController.deleteProductFromCart)

    //Xem danh sách sản phẩm trong giỏ hàng
    router.post('/account', auth.authenUser, CartController.getCart)

    //Xem đon đặt hàng
    router.get('/order', auth.authenUser, OrderController.getOrder)

    //Thanh toán 
    router.post('/pay', auth.authenUser, CartController.pay)

    //Sửa thông tin cá nhân 
    router.post('/modified/:id_account', auth.authenUser, UserController.updateInfo)

    router.post('/search', UserController.searchProduct)

    router.post('/search-category', UserController.searchCategory)
    //---------------Admin----------------------------
    //Lấy tất cả danh sách tài khoản khách hàng
    router.get('/admin/account', auth.authenAdmin, UserController.listAccount)

    //Xem chi tiết sản phẩm theo id_product
    router.get('/chitiet?:id', APIController.getDetail_1_Product)

    //Sản phẩm
    router.get('/admin/product?:id', APIController.getDetailProduct)// lấy tất cả sản phẩm theo danh mục
    router.post('/admin/createNewProduct', upload.single('images'), auth.authenAdmin, APIController.createNewProduct)
    router.post('/admin/updateProduct/:id_product/:id_category', upload.single('images'), auth.authenAdmin, APIController.updateProduct)
    router.delete('/admin/deleteProduct/:id_product', auth.authenAdmin, APIController.deleteProduct)

    //Danh mục
    router.get('/testthu', APIController.getCategoryPhong)
    router.get('/category?:id', APIController.getCategory)
    router.post('/admin/createcategory', auth.authenAdmin, upload.single('logo'), APIController.createNewCategory)
    router.post('/admin/updateCategory?:id', auth.authenAdmin, upload.single('logo'), APIController.updateCategory)
    router.delete('/admin/deleteCategory?:id_category', auth.authenAdmin, APIController.deleteCategory)

    //Đơn hàng
    router.get('/testthu-product', APIController.getProductPhong)
    router.get('/admin/getorders', auth.authenAdmin, OrderController.getOrderNew)
    router.get('/admin/detailorder/:id_order', OrderController.getDetailOrder)
    router.post('/admin/xacnhandonhang/:id_order', OrderController.xacNhanDonHang)
    router.post('/admin/hoanthanhdonhang/:id_order', OrderController.hoanThanhDonHang)
    router.post('/admin/huydonhang/:id_order', OrderController.huyDonHang)

    //Đăng nhập của admin
    router.post('/admin/login', APIController.handleAdminLogin)

    //Doanh số
    router.get('/admin/doanhso', OrderController.xemDoanhSo)
    // router.get('/admin/deleteProduct/:id_product', (req) => {
    //     console.log('Hello');
    // }
    // )

    //APi đánh giá năng lực
    router.get('/account/xemDanhGia?:id_product', APIController.getRated)
    router.post('/account/rating', APIController.rateComment)
    return app.use('/api/v1/', router)
}

export default initAPIRoute