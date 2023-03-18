import pool from "../configs/connectDatabse"
import auth from '../middleware/auth'

//Chức năng thanh toán 
let pay = async (req, res) => {
    try {
        let id_account = auth.tokenData(req).id_account
        //select name,price,images from cart c,product p where c.id_account=id_account and c.id_product =p.id_product
        console.log('id account: ', id_account);
        let check = await checkCart(id_account)
        console.log('Check exist', check.exist);
        if (!check.exist) {
            return res.status(200).json({
                message: 'Chưa có sản phẩm để thanh toán'
            })
        }

        let listProduct = await selectAccount(id_account)
        console.log('>>>> Check list: ', listProduct);
        let totalPrice = 0;

        for (let i in listProduct) {
            let productPrice = listProduct[i].quantity * listProduct[i].price;
            totalPrice += productPrice;
        }

        let deleteProduct = await pool.execute('delete from cart where id_account= ?', [id_account])

        return res.json({
            total: totalPrice
        })
    } catch (err) {
        console.log(err);
    }
}

//===============Xem giỏ hàng trước khi thanh toán
let checkCart = (id_account) => {
    return new Promise(async (resolve, reject) => {
        try {
            //let exist=pool.execute('delete from cart where id_cart=? and id_account=?',[id_cart,id_account])
            let check = {}
            let [rowCount] = await pool.execute('select count(*) as count from cart where id_account=? ', [id_account])
            //console.log(rowCount);
            check.exist = rowCount[0].count > 0
            resolve(
                check
            )
        } catch (error) {
            reject(error)
        }
    })
}

let selectAccount = (id_account) => {
    return new Promise(async (resolve, reject) => {
        try {
            let [data] = await pool.execute
                ('select c.id_product,c.quantity,p.name,p.price,p.images from cart c,product p where c.id_account=? and c.id_product =p.id_product', [id_account])
            //console.log(data);
            resolve(data)
        } catch (error) {
            reject(err)
        }
    })
}


let getCart = async (req, res) => {
    try {
        let id_account = auth.tokenData(req).id_account
        //select name,price,images from cart c,product p where c.id_account=id_account and c.id_product =p.id_product
        let check = await checkCart(id_account)
        if (!check.exist) {
            return res.status(200).json({
                message: 'Chưa có sản phẩm để thanh toán'
            })
        }

        let listProduct = await selectAccount(id_account)
        console.log('>>>> Check list: ', listProduct[0]);
        let totalPrice = 0;

        for (let i in listProduct) {
            let productPrice = listProduct[i].quantity * listProduct[i].price;
            totalPrice += productPrice;
        }
        return res.json({
            list: listProduct,
            total: totalPrice
        })
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }
}
///////////////////////////////////////

//=================Thêm sản phẩm vô giỏ hàng
let hasProductAccount = (id_account, id_product) => {
    return new Promise(async (resolve, reject) => {
        try {
            //let check = {}
            let [data] = await pool.execute('select * from cart where id_account= ? and id_product=?', [id_account, id_product])
            let result = { ...data[0] }
            if (!data[0]) {
                resolve(false)
            }
            else {
                console.log('>>> Check data[0]: ', result);
                resolve(result)
            }
        }
        catch (err) {
            reject(err)
        }
    })
}

let addQuantity = (id_cart, quantity) => {
    return new Promise(async (resolve, reject) => {
        try {
            let add = await pool.execute('update cart set quantity = quantity + ? where id_cart= ?',
                [quantity, id_cart])
            // console.log('Check addQuantity: ', add);
            resolve(add)
        } catch (error) {
            reject(error)
        }
    })
}

let addCart = (id_account, id_product, quantity) => {
    return new Promise(async (resolve, reject) => {
        try {
            let add = await pool.execute('insert into cart (id_account, id_product, quantity) values (?,?,?)',
                [id_account, id_product, quantity])
            //console.log('Check addCart: ', add);
            resolve(add)
        } catch (error) {
            reject(error)
        }
    })
}

let addProduct = async (req, res) => {
    try {
        let { id_product } = req.params
        let quantity = Number(req.body.quantity)
        let id_account = auth.tokenData(req).id_account
        console.log('Test body: ', id_product, quantity, id_account);
        if (quantity < 1) {
            return res.json({
                message: 'Số lượng phải lớn hơn 0'
            })
        }

        if (!quantity) {
            quantity = 1
        }

        //Check xem sản phẩm muốn thêm có trong giỏ hàng chưa
        let check = await hasProductAccount(id_account, id_product)

        if (!check) {
            let add = await addCart(id_account, id_product, quantity)
            return res.status(200).json({
                message: 'Thêm vào giỏ hàng thành công'
            })
        } else {
            let id_cart = check.id_cart
            let add = await addQuantity(id_cart, quantity)
            return res.status(200).json({
                message: 'Thêm thành công'
            })
        }
    } catch (error) {
        console.log(err);
        return res.sendStatus(500)
    }
}
////////////////////////////////////////

//=========Xóa 1 sản phẩm khỏi giỏ hàng
let deleteProduct = (id_product, id_account) => {
    return new Promise(async (resolve, reject) => {
        try {
            let deleted = await pool.execute('delete from cart where id_product=? and id_account=?', [id_product, id_account])
            console.log('>>Check delete Product', deleted);
            resolve(deleted)
        } catch (error) {
            reject(error)
        }
    })
}

let hasCart = (id_product, id_account) => {
    return new Promise(async (resolve, reject) => {
        try {
            //let exist=pool.execute('delete from cart where id_cart=? and id_account=?',[id_cart,id_account])
            let check = {}
            let [rowCount] = await pool.execute('select count(*) as count from cart where id_product=? and id_account=? ', [id_product, id_account])
            console.log(rowCount);
            check.exist = rowCount[0].count > 0
            resolve(
                check
            )
        } catch (error) {
            reject(error)
        }
    })
}

let deleteProductFromCart = async (req, res) => {
    try {
        let id_product = req.params.id_product
        let id_account = auth.tokenData(req).id_account
        if (!id_product) {
            return res.json({
                message: "Giỏ hàng không tồn tại"
            })
        }
        let check = await hasCart(id_product, id_account)
        if (check.exist) {
            let deleted = await deleteProduct(id_product, id_account)
        }
        else {
            return res.json({
                message: 'Giỏ hàng không tồn tại'
            })
        }
        return res.json({
            message: 'Xóa Thành công sản phẩm trong giỏ'
        })
    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }
}

let addCategory = (name, logo) => {
    return new Promise(async (resolve, reject) => {
        try {
            let add = await pool.execute('insert into category (name, logo) values (?,?)',
                [name, logo])
            //console.log('Check addCart: ', add);
            resolve(add)
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getCart,
    addProduct,
    deleteProductFromCart,
    pay,
    addCategory
}