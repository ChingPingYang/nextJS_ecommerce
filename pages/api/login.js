import User from '../../models/User';
import connectDB from '../../utils/connectDb';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
const { parseCookies, setCookie, destroyCookie } = require('nookies');
import { authorizeToken } from '../../utils/auth';

connectDB();

export default (req, res) => {
    switch(req.method) {
        case "GET":
            return handleGet(req, res);
        case "POST":
            return handlePost(req, res);
        default: 
            return res.status(405).json({errmsg: `Method ${req.method} not allowed`})
    }
}

const handleGet = async (req, res) => {
    // 1) Check if token is provided
    const response = authorizeToken(req, res);
    if(!response.userId) return res.status(403).json({errmsg: response})
    
    // 2) Try to get user 
    try {
        const user = await User.findById(response.userId);
        res.status(200).json(user);
    } catch(err) {
        console.log(err)
        return res.status(500).json({ errmsg: "Server error... try later"});
    }   
}




const handlePost = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.status(422).json({ errmsg: 'All fields are required.'});
    try {
        // 1) Check if user exist
        const user = await User.findOne({ email }).select('+password');
        
        if(!user) return res.status(404).json({ errmsg: `User ${email} doesn't exist.`});

        // 2) Check if password match
        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(404).json({ errmsg: `Please insert the correct password.`});
 
        // 3) Give token
        const payload = { userId: user._id};
        const token = JWT.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })
        // 4) Set cookie for 1 day
        const age = 60*60*24
        setCookie({res}, "token", token, {
            maxAge: age
        })
        // 5) return user without password
        const userWithNoPassword = { _id: user._id, name: user.name, email: user.email, role: user.role}
        return res.status(201).json(userWithNoPassword);
    } catch(err) {
        console.log(err)
        return res.status(500).json({ errmsg: "Server error... try later"});
    }
};