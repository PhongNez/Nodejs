import pool from "../configs/connectDatabse"
import bcrypt from 'bcryptjs';
import userService from "../services/userService"
import auth from "../middleware/auth"
const salt = bcrypt.genSaltSync(10);
let findOneUser = async (req, res) => {


    const [rows, fields] = await pool.execute('SELECT id,fullName,email,address,phoneNumber FROM users_test where email=?', ['tptn1234@gmail.com']);
    // console.log(typeof (data), JSON.stringify(data));
    // return res.render('index.ejs', { dataUser: rows })
    return res.status(200).json({
        data: rows[0]
    })
}

let createNewUser_hash = async (req, res) => {
    let { fullName, email, password } = req.body

    //bắt lỗi trống thông tin
    if (!fullName || !email || !password) {
        return res.status(200).json({
            message: "Thất bại mịa rồi"
        })
    }


    if (!password) {
        return res.status(200).json({
            message: "Thất bại mịa rồi"
        })
    }
    //băm cái mật khẩu ra trăm mảnh
    let hashPasswordFromBcrypt = await hashUserPassword(password)
    //thực thi lênh sql
    await pool.execute('insert into users_test (fullname,email,password) values (?,?,?)', [fullName, email, hashPasswordFromBcrypt])
    // console.log(hashPasswordFromBcrypt);
    return res.status(200).json({
        message: "Thành công",
        password: hashPasswordFromBcrypt
    })
}

let hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {

        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (error) {
            reject(error)
        }


    })
}

let createNewUser = async (req, res) => {
    let { email, password } = req.body


    //bắt lỗi trống thông tin
    if (!email && !password) {
        return res.status(200).json({
            message: "Tài khoản hoặc mật khẩu bị bỏ trống"
        })
    }
    let checkEmail = await userService.checkUserEmail(email)
    console.log(checkEmail);
    if (!checkEmail) {
        //băm cái mật khẩu ra trăm mảnh
        let hashPasswordFromBcrypt = await hashUserPassword(password)
        //thực thi lênh sql
        await pool.execute('insert into account (email,password) values (?,?)', [email, hashPasswordFromBcrypt])
        // console.log(hashPasswordFromBcrypt);
        return res.status(200).json({
            message: "Thành công",
            password: hashPasswordFromBcrypt
        })
    }
    else {
        return res.status(200).json({
            message: "Email đã được đăng ký"
        })
    }
}

//Đổi mật khẩu
let changePassword = async (req, res) => {
    try {
        let newPassword = req.body.newPassword
        let id_account = auth.tokenData(req).id_account
        if (newPassword.trim() != '') {
            newPassword = newPassword.trim()
            let hashPasswordFromBcrypt = await hashUserPassword(newPassword)
            newPassword = hashPasswordFromBcrypt
            let change = await pool.execute('update account set password=? where id_account=?', [newPassword, id_account])
            return res.status(200).json({
                message: 'Đổi mật khẩu thành công'
            })
        }
        else {
            return res.status(500).json({
                message: 'Không được bỏ trống'
            })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    findOneUser,
    createNewUser_hash,
    createNewUser,
    changePassword,
    hashUserPassword
}