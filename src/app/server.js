import express from 'express';
import 'dotenv/config'
import morgan from 'morgan'
import cors from 'cors'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import xss from 'xss-clean'
import hpp from 'hpp'
import fs from 'fs'
import path from 'path'
const app = express();


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.raw())
app.use(express.text())
app.use(morgan('dev'))
app.use(cors())
app.use(mongoSanitize()) //Use for security to prevent NoSql injections
app.use(helmet()) //Adds extra headers to protect the routes
app.use(xss()) //To prevent a harmful script being sent with the POST request
app.use(hpp()) //To prevent HTTP Parameter Pollution.


/**
 * Initiate the Routes
 * All Routes to begin with /api/v1/{the routes}
 */
 const router = express.Router()
 app.use('/api/v1', router)
 
;

// Default Route
router.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Fraud Detection - API',
        author: 'iSICHEI PHELIM',
      
    })
})
/**
 * The Routes
 */
// Error Route
app.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Oops you have missed your way',
        author: 'Isichei Phelim',
        website: '',
    })
})

import userRoutes from '../app/users/users.routes.js'
userRoutes(router)

import transactionRoutes from '../app/transactions/tramsactions.routes.js';
transactionRoutes(router)

import fraudRoutes from '../app/fraudAnalyzer/fraud.routes.js';
fraudRoutes(router)
export { app }
