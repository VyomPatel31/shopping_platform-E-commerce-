import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const userSchema = new mongoose.Schema({
    email: String,
    isVerified: Boolean,
});

const User = mongoose.model('User', userSchema);

async function checkUsers() {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI!);
        const users = await User.find({});
        console.log('Total users found:', users.length);
        for (const u of users) {
             console.log(`- ${u.email} (Verified: ${u.isVerified})`);
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error('ERROR:', err);
    }
}

checkUsers();
