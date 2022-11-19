import express from 'express'
import * as dotenv from 'dotenv'
import {userRoutes} from "./routes/users/users";
import {baseRoutes} from "./routes/base";

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || "127.0.0.1"

const start = async () => {
    app.use('/', baseRoutes)
    app.use('/users', userRoutes)

    app.listen(+PORT, () => console.log(`Server running on ${HOST}:${PORT}`))
}

start().catch(err => console.error(err))





