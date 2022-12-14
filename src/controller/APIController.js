import { verify } from "jsonwebtoken";
import pool from "../configs/connectDatabse"
import userService from "../services/userService"


//API login
let handleLogin = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            message: 'Bạn nhập thiếu email hoặc password'
        })
    }

    //Trả về dữ liệu người dùng
    let userData = await userService.handleUserLogin(email, password)
    return res.status(200).json({
        // errorCode: 0,
        // message: 'Hello Phong',
        // email: email,
        // test: 'Đăng nhập thành công'
        error: userData.errCode,
        message: userData.errMess,
        userData: userData.user
    })
}

//Sản phẩm
let getProduct = async (req, res) => {
    //const [rows, fields] = await pool.execute('SELECT * FROM product');
    const [data] = await pool.execute('SELECT * FROM product');
    //verify
    console.log();
    return res.status(200).json({
        dataProduct: data
        //test: 'OK'
    })
}

//Thêm quần áo
let createNewProduct = async (req, res) => {

    let { name, detail, price, images, type, status, id_category } = req.body

    //bắt lỗi trống thông tin
    if (!name || !detail || !price || !images || !id_category) {
        return res.status(200).json({
            message: "Không được bỏ trống thông tin!"
        })
    }

    //thực thi lênh sql
    let insert = await pool.execute('insert into product (id_category,name, detail, price, images, type, status) values (?,?,?,?,?,?,?)', [id_category, name, detail, price, images, type, status])
    return res.status(200).json({
        message: "Chúc mừng đã thêm thành công"
    })
}

//update quần áo
let updateProduct = async (req, res) => {

    let { name, detail, price, images, type, status, id_category } = req.body
    let { id_product } = req.params

    if (!name || !detail || !price || !images || !id_category || !id_product) {
        return res.status(200).json({
            message: "Không được bỏ trống thông tin"
        })
    }

    let update = await pool.execute
        ('update product set name=?,detail=?,price=?,images=?, type=?, status=?,id_category=? where id_product=?',
            [name, detail, price, images, type, status, id_category, id_product])


    return res.status(200).json({
        message: "Chúc mừng đã cập nhật thành công"
    })
}

let deleteProduct = async (req, res) => {
    let { id_product } = req.params// id trùng tên với id đường dẫn

    if (!id_product) {
        return res.status(200).json({
            message: "Thất bại rồi"
        })
    }

    let del = await pool.execute(`delete from product where id_product=?`, [id_product])

    return res.status(200).json({
        message: "Chúc mừng đã xóa thành công"
    })
}



module.exports = {
    handleLogin,
    getProduct,
    createNewProduct,
    updateProduct,
    deleteProduct
} 