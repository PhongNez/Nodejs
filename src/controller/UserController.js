import pool from "../configs/connectDatabse"
import bcrypt from 'bcryptjs';
import userService from "../services/userService"
import auth from "../middleware/auth"
const salt = bcrypt.genSaltSync(10);

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

//Đăng ký tài khoản
let createNewUser = async (req, res) => {
    let { email, password } = req.body

    //bắt lỗi trống thông tin
    if (!email && !password) {
        return res.status(200).json({
            message: "Tài khoản hoặc mật khẩu bị bỏ trống"
        })
    }

    //Kiểm tra mail có trong csdl
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
let handleOldPassword = (id_account) => {
    return new Promise(async (resolve, reject) => {
        try {
            let [checkCurrenPassword] = await pool.execute('select password from account where id_account=?', [id_account])
            resolve(checkCurrenPassword[0].password)
        }
        catch (err) {
            reject(err)
        }
    })
}

let changePassword = async (req, res) => {
    try {
        let { oldPassword, newPassword } = req.body//Nhập 1 password cũ, 1 password mới
        let hashPasswordFromBcrypt = ''// mã hóa password mới
        let id_account = auth.tokenData(req).id_account
        let currenPassword = await handleOldPassword(id_account)

        let check = bcrypt.compareSync(oldPassword, currenPassword)
        console.log(check);
        if (!check) {
            return res.status(400).json({
                message: 'Mật khẩu cũ không hợp lệ!'
            })
        }
        //if(oldPassword == )
        if (newPassword.trim() != '') {
            newPassword = newPassword.trim()
            hashPasswordFromBcrypt = await hashUserPassword(newPassword)
            newPassword = hashPasswordFromBcrypt
            await pool.execute('update account set password=? where id_account=?', [newPassword, id_account])
            return res.status(200).json({
                message: 'Đổi mật khẩu thành công!'
            })
        }
        else {
            return res.status(500).json({
                message: 'Vui lòng không được bỏ trống mật khẩu!'
            })
        }
    } catch (error) {
        console.log(error);
    }
}

let handleUpdate = (name, phone, address, avatar, id_account) => {
    return new Promise(async (resolve, reject) => {
        try {
            let update = await pool.execute('update account set name=?,phone=?,address=?,avatar=? where id_account=?', [name, phone, address, avatar, id_account])
            resolve(update)
        } catch (err) {
            reject(err)
        }
    })
}

let updateInfo = async (req, res) => {
    try {
        let { name, phone, address, avatar } = req.body
        let { id_account } = req.params
        if (!name || !phone || !address || !avatar) {
            return res.status(400).json({
                message: 'Không được bỏ trống!'
            })
        }
        let update = await handleUpdate(name, phone, address, avatar, id_account)
        return res.status(200).json({
            message: 'Thành công!'
        })
    }
    catch (err) {
        console.log(err);
    }
}

let getListAccount = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let [list] = await pool.execute('select * from account where role=0')
            resolve(list)
        } catch (err) {
            reject(err)
        }
    })
}

let listAccount = async (req, res) => {
    try {
        let list = await getListAccount()
        return res.status(200).json({
            message: list
        })
    } catch (err) {
        console.log(err);
    }
}

let searchProduct = async (req, res) => {
    try {
        let { name } = req.body
        let [search] = await pool.execute("select * from product where name like ?", [name + '%'])
        return res.status(200).json({
            message: search
        })
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    createNewUser,
    changePassword,
    hashUserPassword,
    updateInfo,
    listAccount,
    searchProduct
}