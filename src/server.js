import express from "express"
import configViewEngine from "./configs/viewEngine";
import initWebRouter from "./route/web"
import connection from "./configs/connectDatabse"

import initAPIRoute from "./route/api"
require('dotenv').config()

//test JWT
import { createJWT, verifyJWT } from "./middleware/JWTAction"

const app = express()
const port = process.env.PORT

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// createJWT()
// verifyJWT('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUGhvbmciLCJuZ2FuaCI6ImPDtG5nIG5naOG7hyB0aMO0bmcgdGluIiwiaWF0IjoxNjYzNDkyMzg1fQ.cMItnm-utS7ybNFhustcGDUREMPVS9ZO6WJLbMryibQ')
configViewEngine(app)

initWebRouter(app)

initAPIRoute(app)
app.use((req, res) => {
    res.send('404 NOT FOUND')
})

app.listen(port, () => {
    console.log(`Example app listening on port localhost:${port}`)
})