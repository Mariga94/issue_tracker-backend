import mongoose from 'mongoose';


const connectToMongoDB = (uri: string) => {
    mongoose.connect(uri);

    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB')
    });

    mongoose.connection.on('error', (error) => {
        console.error('Error connecting to DB ....', error.message)
    })

    mongoose.connection.on('disconnected', () => {
        console.log('Disconnected from MongoDB');
    });

    process.on('SIGINT',() => {
        mongoose.connection.close()
    })
}

export default connectToMongoDB