import mongoose from 'mongoose';

const connection = {};

const connectDB = async () => {
    if(connection.isConnected) {
        console.log('DB was connected@@');
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_SRV, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        connection.isConnected = db.connections[0].readyState;
        console.log('DB connected');
    } catch(err) {
        console.log('Failed to connect to DB...');
    }
}

export default connectDB;