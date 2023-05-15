import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
//set directory dirname 

dotenv.config({ path: path.join(path.resolve(), './config/.env') })
import express from 'express'
import initApp from './src/index.router.js'
// import createInvoice from './src/utils/Pdf.js';
const app = express()
// setup port and the baseUrl
const port = process.env.PORT 
initApp(app ,express)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))