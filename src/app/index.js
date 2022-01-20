import { app } from './server.js'
import 'dotenv/config'
import { database } from '../config/database.js'
const port = process.env.PORT || 3000;
app.listen(port, async () => {
     database()
    console.log(`Fraud Detection Service listening at http://localhost:${port}`)
})