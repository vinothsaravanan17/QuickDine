import mongoose from 'mongoose'
import { on } from 'node:cluster'

async function ConnectDb() {
    mongoose.connection.on('connected', () => console.log('mongodb connected'));
    await mongoose.connect(process.env.MONGODB_URL!)
}

export default ConnectDb