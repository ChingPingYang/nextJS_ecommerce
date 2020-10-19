import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin', 'root']
        // Lock down the options
    }
}, {timestamps: true})

let User;
try {
    User = mongoose.model('users');
}catch(err) {
    User = mongoose.model('users', UserSchema);
}

export default User;