import { verify } from "jsonwebtoken";
import pool from "../configs/connectDatabse"
import userService from "../services/userService"
let getAllUsers = async (req, res) => {
    const [rows, fields] = await pool.execute('SELECT * FROM users');
    return res.status(200).json({
        message: 'OK',
        dataUsers: rows
    })
}

let createNewUsers = async (req, res) => {

    let { firstName, lastName, email, address } = req.body

    //bắt lỗi trống thông tin
    if (!firstName || !lastName || !email || !address) {
        return res.status(200).json({
            message: "Thất bại mịa rồi"
        })
    }

    //thực thi lênh sql
    await pool.execute('insert into users (firstname,lastname,email,address) values (?,?,?,?)', [firstName, lastName, email, address])
    return res.status(200).json({
        message: "Chúc mừng đã thêm thành công"
    })
}

let updateUser = async (req, res) => {

    let { firstName, lastName, email, address, id } = req.body

    if (!firstName || !lastName || !email || !address || !id) {
        return res.status(200).json({
            message: "Thất bại mịa rồi"
        })
    }


    await pool.execute('update users set firstname=?,lastname=?,email=?,address=? where id=?', [firstName, lastName, email, address, id])

    return res.status(200).json({
        message: "Chúc mừng đã cập nhật thành công"
    })
}

let deleteUser = async (req, res) => {
    let userId = req.params.id// id trùng tên với id đường dẫn

    if (!userId) {
        return res.status(200).json({
            message: "Thất bại mịa rồi"
        })
    }



    await pool.execute(`delete from users where id=?`, [userId])

    return res.status(200).json({
        message: "Chúc mừng đã xóa thành công"
    })
}

let getOneUser = async (req, res) => {
    let userId = req.params.id
    if (!userId) {
        return res.status(200).json({
            message: "Thất bại mịa rồi"
        })
    }
    const [rows, fields] = await pool.execute('SELECT * FROM users where id=?', [userId]);

    return res.status(200).json({
        message: 'OK',
        dataUsers: rows
    })
}

//API login
let handleLogin = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            message: 'Bạn nhập thiếu email hoặc password'
        })
    }

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
    await pool.execute('insert into product (id_category,name, detail, price, images, type, status) values (?,?,?,?,?,?,?)', [id_category, name, detail, price, images, type, status])
    return res.status(200).json({
        message: "Chúc mừng đã thêm thành công"
    })
}

//update quần áo
let updateProduct = async (req, res) => {

    let { name, detail, price, images, type, status, id_category } = req.body
    let id_product = req.params.id_product

    if (!name || !detail || !price || !images || !id_category || !id_product) {
        return res.status(200).json({
            message: "Không được bỏ trống thông tin"
        })
    }

    await pool.execute
        ('update product set name=?,detail=?,price=?,images=?, type=?, status=?,id_category=? where id_product=?',
            [name, detail, price, images, type, status, id_category, id_product])


    return res.status(200).json({
        message: "Chúc mừng đã cập nhật thành công"
    })
}

let deleteProduct = async (req, res) => {
    let id_product = req.params.id_product// id trùng tên với id đường dẫn

    if (!id_product) {
        return res.status(200).json({
            message: "Thất bại mịa rồi"
        })
    }

    await pool.execute(`delete from product where id_product=?`, [id_product])

    return res.status(200).json({
        message: "Chúc mừng đã xóa thành công"
    })
}

module.exports = {
    getAllUsers,
    createNewUsers,
    updateUser,
    deleteUser,
    getOneUser,
    handleLogin,
    getProduct,
    createNewProduct,
    updateProduct,
    deleteProduct
} 