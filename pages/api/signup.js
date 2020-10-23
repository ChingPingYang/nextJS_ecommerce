import User from '../../models/User';
import Cart from '../../models/Cart';
import bcrypt from 'bcrypt';
import connectDB from '../../utils/connectDb';
import JWT from 'jsonwebtoken';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import { setCookie } from 'nookies';

connectDB();

export default (req, res) => {
    switch(req.method) {
        case "POST":
            return handlePost(req, res)
        default:
            return res.status(405).json({msg: `Method ${req.method} not allowed`})
    }
}

const handlePost = async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) return res.status(403).json({errmsg: "All fields are required."});
    try {
        // 1) Checking if inputs are valid
        if(!isLength(name, { min: 3, max: 10})){
            return res.status(422).json({errmsg: "Name must be 3-10 characters"});
        } else if(!isLength(password, { min: 6})) {
            return res.status(422).json({errmsg: "Password must be at least 6 characters"});
        } else if(!isEmail(email)) {
            return res.status(422).json({errmsg: "Email is not valid"});   
        }
        
        // 2) Checking if user exits.
        const existed = await User.findOne({ email });
        if(existed) return res.status(422).json({errmsg: `User ${email} existed!`});

        // 3) Hash password.
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4) Create user and save to DB.
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        // 5) Create Cart for the user
        await new Cart({ user: user._id }).save();

        // 6) Create token and send back to the client. 
        const payload = { userId: user._id };
        // this runs synchronously so no need to await. Also it will expire in 3 days.
        const token = JWT.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        // 7) Set cookie from server
        const age = 60*60*24
        setCookie({ res }, "token", token, {
            maxAge: age
        })
        // 8) return user without password
        const userWithNoPassword = { _id: user._id, name: user.name, email: user.email, role: user.role}
        return res.status(201).json(userWithNoPassword);
    } catch(err) {
        // console.log(err)
        return res.status(500).json({ errmsg: "Server error... try later"});
    }
}