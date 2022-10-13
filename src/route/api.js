import express from "express";

import APIController from "../controller/APIController"
import UserController from "../controller/UserController"
import cartController from '../controller/cartController'
import mailController from "../controller/mailController"
import orderController from "../controller/orderController"
let router = express.Router();

import auth from '../middleware/auth'

const initAPIRoute = (app) => {
    router.get('/users', APIController.getAllUsers);
    router.post('/create-user', APIController.createNewUsers);
    router.put('/update-user', APIController.updateUser)//method: put
    router.delete('/delete-user/:id', APIController.deleteUser)
    //get 1 user
    router.get('/users/:id', APIController.getOneUser)

    //login
    router.post('/login', APIController.handleLogin)
    //băm password
    router.post('/hashpassword', UserController.createNewUser_hash)

    router.post('/test', UserController.findOneUser)

    //Sản phẩm
    router.get('/product', APIController.getProduct)

    //Thêm sản phẩm
    router.post('/createNewProduct', APIController.createNewProduct)

    //update sản phẩm
    router.put('/updateProduct/:id_product', APIController.updateProduct)

    //Xóa sản phẩm
    router.delete('/deleteProduct/:id_product', APIController.deleteProduct)

    //Xem danh sách giỏ hàng
    router.post('/account', auth.authenUser, cartController.getCart)

    //Thêm vào giỏ hàng
    router.post('/product/:id_product', auth.authenUser, cartController.addProduct)

    //Xóa sản phẩm trong giỏ hàng
    router.delete('/product/:id_product', auth.authenUser, cartController.deleteProductFromCart)

    //Tạo tài khoản
    router.post('/account/signup', UserController.createNewUser)

    //Đổi mật khẩu
    router.post('/changepassword', UserController.changePassword)

    //Quên mật khẩu 
    router.post('/forgot-password', mailController.forgotPassword)

    //Xác nhận mã xác minh
    router.post('/confirm/:id_account', mailController.confirm)

    //Xem đon đặt hàng
    router.get('/order', auth.authenUser, orderController.getOrder)

    //Xem chi tiết đơn đặt hàng
    router.get('/detailOrder', orderController.getDetailOrder)

    //Thanh toán 
    router.post('/pay', auth.authenUser, cartController.pay)
    return app.use('/api/v1/', router)
}

export default initAPIRoute