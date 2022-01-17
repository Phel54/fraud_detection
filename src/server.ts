import express, { Application, Router} from 'express';
import 'dotenv/config'
import morgan from 'morgan';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import xss from 'xss-clean';


const app: Application = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.raw())
app.use(express.text())
app.use(morgan('dev'))
app.use(cors())
app.use(mongoSanitize()) //Use for security to prevent NoSql injections
app.use(helmet()) //Adds extra headers to protect the routes
app.use(hpp()) //To prevent HTTP Parameter Pollution.
app.use(xss()) //To prevent a harmful script being sent with the POST request


/**
 * Initiate the Routes
 * All Routes to begin with /api/v1/{the routes}
 */
 const router = express.Router()
 app.use('/api/v1', router);


 // Default Route
router.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Dues App - API',
        author: 'Wonchunii Ltd',
        website: 'www.wonchunii.com',
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
        author: 'Wonchunii Ltd',
        website: 'www.wonchunii.com', 
    })
})
import userRouter from './app/users/users.routes';
router.use('/users',userRouter);


export default app;

