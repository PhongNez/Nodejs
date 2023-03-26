import { verify } from "jsonwebtoken";
import pool from "../configs/connectDatabse"
import userService from "../services/userService"


//API login
let handleLogin = async (req, res) => {
    let { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            errCode: 1,
            message: 'Bạn nhập thiếu email hoặc password'
        })
    }
    console.log('Phong: ', req.body);
    //console.log(req.body);
    //Trả về dữ liệu người dùng
    let userData = await userService.handleUserLogin(email, password)
    return res.status(200).json({
        // errorCode: 0,
        // message: 'Hello Phong',
        // email: email,
        // test: 'Đăng nhập thành công'
        errCode: userData.errCode,
        message: userData.message,
        userData: userData.user
    })
}

let handleAdminLogin = async (req, res) => {
    let { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            errCode: 1,
            message: 'Bạn nhập thiếu email hoặc password'
        })
    }
    console.log('Phong: ', req.body);
    //console.log(req.body);
    //Trả về dữ liệu người dùng
    let userData = await userService.handleAdminLogin(email, password)
    return res.status(200).json({
        // errorCode: 0,
        // message: 'Hello Phong',
        // email: email,
        // test: 'Đăng nhập thành công'
        errCode: userData.errCode,
        message: userData.message,
        userData: userData.user
    })
}
//Sản phẩm
let getProduct = async (req, res) => {
    //const [rows, fields] = await pool.execute('SELECT * FROM product');
    const [data] = await pool.execute('SELECT * FROM product');
    //verify
    console.log('Phong ngao');
    return res.status(200).json({
        dataProduct: data
        //test: 'OK'
    })
}

//Thêm quần áo
let createNewProduct = async (req, res) => {

    let { name, detail, price, id_category } = req.body
    console.log('Phong body:', req.body)
    console.log('Req.file: ', req.file);


    let images = req.file.filename

    //bắt lỗi trống thông tin
    if (!name || !detail || !price || !images || !id_category) {
        return res.status(200).json({
            message: "Không được bỏ trống thông tin!"
        })
    }

    //thực thi lênh sql
    let insert = await pool.execute('insert into product (id_category,name, detail, price, images) values (?,?,?,?,?)', [id_category, name, detail, price, images])
    return res.status(200).json({
        message: "Chúc mừng đã thêm thành công"
    })
}

//update quần áo
let updateProduct = async (req, res) => {

    let { name, detail, price, id_category } = req.body

    let id_product = req.params.id_product
    let id_category_param = req.params.id_category
    let update = '';

    if (!name || !detail || !price || !id_category || !id_product) {
        return res.status(200).json({
            message: "Không được bỏ trống thông tin"
        })
    }
    if (req.file && req.file.filename) {
        let images = req.file.filename
        update = await pool.execute
            ('update product set name=?,detail=?,price=?,images=?,id_category=? where id_product=? and id_category=?',
                [name, detail, price, images, id_category, id_product, id_category_param])
    }
    else {
        update = await pool.execute
            ('update product set name=?,detail=?,price=?,id_category=? where id_product=? and id_category=?',
                [name, detail, price, id_category, id_product, id_category_param])
    }
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
        message: "Chúc mừng bạn đã xóa thành công"
    })
}

let createNewCategory = async (req, res) => {

    let name = req.body.name
    // let logo = req.file.filename
    //bắt lỗi trống thông tin
    if (!req.file || !name) {
        return res.status(200).json({
            errCode: 2,
            message: 'Không được bỏ trống thông tin'
        })
    }
    console.log('File', req.file);

    let logo = req.file.filename
    console.log('Check', name, logo);
    //thực thi lênh sql
    try {
        let insert = await pool.execute('insert into category (name,logo) values (?,?)', [name, logo])
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: 1,
            message: 'Thêm thất bại. Tên sản phẩm trùng'
        })
    }


    return res.status(200).json({
        errCode: 0,
        message: "Chúc mừng đã thêm thành công"
    })
}

let getCategory = async (req, res) => {


    //thực thi lênh sql
    try {
        let id = req.query.id;
        console.log(id);
        console.log("id query: ", id);
        let response = ''
        if (id === 'ALL') {
            [response] = await pool.execute('select * from category')
        }
        else {
            [response] = await pool.execute('select * from category where id_category=?', [id])
        }
        console.log(response);
        return res.status(200).json(
            { listCategory: response }
        )
    } catch (error) {
        console.log(error);
    }


}

let getDetailProduct = async (req, res) => {


    //thực thi lênh sql
    try {
        let id = req.query.id;
        console.log(id);
        console.log("id query: ", id);
        let response = ''
        if (id === 'ALL') {
            [response] = await pool.execute('select *,p.name as name_product from product p,category c where p.id_category=c.id_category')
        }
        else {
            [response] = await pool.execute('select * from product where id_category=?', [id])
        }
        console.log(response);
        return res.status(200).json(
            { listProduct: response }
        )
    } catch (error) {
        console.log(error);
    }


}


let getDetail_1_Product = async (req, res) => {


    //thực thi lênh sql
    try {
        let id = req.query.id;
        console.log(id);
        console.log("id query: ", id);
        let response = ''
        if (id === 'ALL') {
            [response] = await pool.execute('select * from product')
        }
        else {
            [response] = await pool.execute('select * from product where id_product=?', [id])
        }
        console.log(response);
        return res.status(200).json(
            { listProduct: response }
        )
    } catch (error) {
        console.log(error);
    }


}

//update danh mục
let updateCategory = async (req, res) => {

    let { name } = req.body
    let id_category = req.query.id
    let update = ''
    if (req.file && req.file.filename) {
        let logo = req.file.filename

        update = await pool.execute
            ('update category set name=?,logo=? where id_category=?',
                [name, logo, id_category])
        console.log('name: ', name, 'Lo go :', logo, 'id_category: ', id_category);
        // if (!name || !logo || !id_category) {
        //     return res.status(200).json({
        //         message: "Không được bỏ trống thông tin"
        //     })
        // }

    } else {
        update = await pool.execute
            ('update category set name=? where id_category=?',
                [name, id_category])
    }
    return res.status(200).json({
        message: "Chúc mừng đã cập nhật thành công"
    })
}

let deleteCategory = async (req, res) => {
    try {
        let { id_category } = req.query// id trùng tên với id đường dẫn
        console.log(req.query);
        if (!id_category) {
            return res.status(200).json({
                message: "Thất bại rồi"
            })
        }

        let del = await pool.execute(`delete from category where id_category=?`, [id_category])
    }
    catch (err) {
        console.log(err);
    }
    return res.status(200).json({
        message: "Chúc mừng đã xóa thành công"
    })
}


module.exports = {
    handleLogin,
    getProduct,
    createNewProduct,
    updateProduct,
    deleteProduct,
    createNewCategory,
    getCategory,
    getDetailProduct,
    getDetail_1_Product,
    updateCategory,
    deleteCategory,
    handleAdminLogin
} 