import mongoose from 'mongoose';
import Logger from '../helpers/logger';

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CNN || '');
        Logger.success('DB Connected OK!');
    } catch (err) {
        Logger.error(`Error starting DB Connection:\n${err}`)
        throw new Error(`Error starting DB Connection:\n${err}`);
    }
};

export default dbConnection;
