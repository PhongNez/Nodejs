import pool from "../configs/connectDatabse"
import userService from "../services/userService"
import mail from "../services/mail"
import userController from "./UserController"
import bcrypt from 'bcryptjs';
import { createJWTTest } from "../middleware/JWTAction"
let getIdAccountEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let [id_account] = await pool.execute('select id_account from account where email=?', [email])
            resolve(id_account[0].id_account)
        } catch (err) {
            reject(err)
        }

    })
}

let insertVerification = (id_account, code) => {
    return new Promise(async (resolve, reject) => {
        try {
            //let check = {}
            console.log('>>>>>>>>>>Check id_account 2: ', id_account);
            let [row] = await pool.execute('insert into verification(id_account,code) values(?,?)', [id_account, code])
            let [id_ver] = await pool.execute('select id_verification from verification where id_account=?', [id_account])
            console.log('>>>>>>>>CHECK:  ', id_ver[0].id_verification);
            let id_verification = id_ver[0].id_verification
            //check.exist = row[0].id_verification
            //check.exist = id_ver
            resolve(
                id_verification
            )
        } catch (error) {
            reject(error)
        }
    })
}



let deleteCode = async (id_verification) => {
    //let del = Verification.delete(id_verification);
    let del = await pool.execute('delete from verification where id_verification=?', [id_verification])
    return del
}

let autoDeleteCode = (id_verification) => {
    setTimeout(deleteCode, 60000, id_verification);
}

let forgotPassword = async (req, res) => {
    try {
        let email = req.body.email

        if (!email) {
            return res.status(401).json({
                message: 'Vui lòng nhập email'
            })
        }

        let exist = await userService.checkUserEmail(email)
        console.log('>>>Check exist: ', exist);
        if (exist) {
            let code = mail.createCode()

            let id_account = await getIdAccountEmail(email)
            console.log('>>>>Check id_Account: ', id_account);
            let sendEmail = mail.sendVerification(email, code)

            code = await userController.hashUserPassword(code)
            console.log('>>>>>>>>>>>>>>>Check code :', code);
            let id_verification = await insertVerification(id_account, code)
            // console.log(id_verification);
            let del = autoDeleteCode(id_verification)
        }
        return res.status(200).json({
            message: 'Thành công'
        })
    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }
}

//Xác nhận mã (hiệu lực trong 60 giây)
let selectAccount = (id_account) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {}
            let [exist] = await pool.execute('select * from account where id_account=?', [id_account])
            data = { ...exist[0] }
            delete data['password']
            resolve(
                data
            )
        } catch (error) {
            console.log(error);
            reject(error)
        }
    })
}

let checkVerification = (id_account) => {
    return new Promise(async (resolve, reject) => {
        try {
            let [exist] = await pool.execute('select * from verification where id_account=?', [id_account])
            resolve(exist[0].code)
        } catch (error) {
            console.log(error);
            reject(error)
        }
    })
}

let confirm = async (req, res) => {
    try {
        let code = req.body.code
        let id_account = req.params.id_account

        if (!code || !id_account) {
            return res.status(200).json({
                message: 'Không được bỏ trống'
            })
        }

        let exist = await checkVerification(id_account)
        console.log(exist);
        if (!exist) {
            return res.status(200).json({
                message: 'Mã xác minh sai hoặc hết hiệu lực'
            })
        } else {
            console.log('>>>>>>>>Check exist:  ', exist);

            let checkPassword = bcrypt.compareSync(code, exist)
            console.log('>>>>>>>>Check password:  ', checkPassword);
            if (checkPassword) {
                let data = await selectAccount(id_account)
                console.log(data);

                let accsessToken = createJWTTest(data)

                return res.status(200).json({
                    accessToken: accsessToken
                })
            }
            else {
                return res.status(500).json({
                    message: 'Sai password'
                })
            }
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }
}

module.exports = {
    forgotPassword,
    confirm
}