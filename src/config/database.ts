import 'dotenv/config';
import mongoose from 'mongoose';

const DB_URL:string = `${process.env.DB_URL}`;
console.log(DB_URL);

export const database = () => {
    mongoose.connect(DB_URL, {
        // poolSize: 5, // Maintain up to 10 socket connections - Default = 5
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    })

    mongoose.connection.on('connected', function () {
       console.log('Mongoose default connection is open');
    })

    mongoose.connection.on('error', function (err) {
        console.log('Mongoose default connection has occured ' + err + ' error')
        
    })

    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection is disconnected')
    })

    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log(
               
                    'Mongoose default connection is disconnected due to application termination',
                
            )
            process.exit(0)
        })
    })
}