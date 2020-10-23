import {authorizeToken} from '../../utils/auth';
import connectDB from '../../utils/connectDb';
import User from '../../models/User';

connectDB();

export default (req, res) => {
    switch(req.method) {
        case "GET":
            return handleGet(req,res);
        case "PUT":
            return handlePut(req,res);
        default:
            return res.status(405).json({errmsg: `Method ${req.method} not allowed`})
    }
}

const handleGet = async (req, res) => {
    const response = authorizeToken(req);
    if(!response.userId) return res.status(403).json({errmsg: response});
    try {
        const users = await User.find({ _id: { $ne: response.userId}}).sort({ role: 'asc'});
        return res.status(200).json(users);
    }catch(err) {
        // console.log(err)
        return res.status(500).json({ errmsg: "Server error... try later"});
    }
}

const handlePut = async (req, res) => {
    const response = authorizeToken(req);
    if(!response.userId) return res.status(403).json({errmsg: response});
    const { userId, role } = req.body;
    try {
        await User.findOneAndUpdate({ _id: userId}, { role });
        return res.status(200).json({msg: 'User role updated.'});
    } catch(err) {
        // console.log(err)
        return res.status(500).json({ errmsg: "Server error... try later"});
    }
}