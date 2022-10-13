import pool from "../configs/connectDatabse";
import auth from "../middleware/auth"

//Xem đơn đặt hàng
let selectOrder = (id_account) => {
    return new Promise(async (resolve, reject) => {
        try {
            let [check] = await pool.execute('select count(*) as count from orders where id_account=?', [id_account])
            let [order] = await pool.execute('select * from orders where id_account=?', [id_account])
            if (check[0].count > 0) {
                resolve(order[0])
            }
            else {
                resolve('Đơn hàng trống')
            }
        } catch (err) {
            console.log(err);
            reject(err)
        }
    })
}

let getOrder = async (req, res) => {
    let id_account = auth.tokenData(req).id_account
    let order = await selectOrder(id_account)
    return res.status(200).json({
        orders: order
    })
}

//Xem chi tiết đơn đặt hàng
let detail = (id_order) => {
    return new Promise(async (resolve, reject) => {
        try {
            let [check] = await pool.execute('select count(*) as count from order_detail where id_order=?', [id_order])
            let [detail] = await pool.execute('select * from order_detail where id_order=?', [id_order])
            if (check[0].count > 0) {
                resolve(detail[0])
            }
            else {
                resolve('Chi tiết đơn hàng trống')
            }
        } catch (err) {
            console.log(err);
            reject(err)
        }
    })
}

let getDetailOrder = async (req, res) => {
    let id_account = auth.tokenData(req).id_account
    //  console.log(id_account);
    let id_order = await selectOrder(id_account)
    // console.log(id_order.id_order);

    let details = await detail(id_order)
    return res.status(200).json({
        detailOrder: details
    })
}


module.exports = {
    getOrder,
    getDetailOrder
}