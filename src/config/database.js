import 'dotenv/config'
import mongoose from 'mongoose'
import chalk from 'chalk'

const connected = chalk.bold.cyan
const error = chalk.bold.yellow
const disconnected = chalk.bold.red
const termination = chalk.bold.magenta
const DB_URL = process.env.DB_URL
export const database = () => {
    mongoose.connect(DB_URL, {
        // poolSize: 5, // Maintain up to 10 socket connections - Default = 5
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    })

    mongoose.connection.on('connected', function () {
        console.log(connected('Mongoose default connection is open'))
    })

    mongoose.connection.on('error', function (err) {
        console.log(
            error('Mongoose default connection has occured ' + err + ' error'),
        )
    })

    mongoose.connection.on('disconnected', function () {
        console.log(disconnected('Mongoose default connection is disconnected'))
    })

    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log(
                termination(
                    'Mongoose default connection is disconnected due to application termination',
                ),
            )
            process.exit(0)
        })
    })
}