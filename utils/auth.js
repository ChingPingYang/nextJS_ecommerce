const { parseCookies } = require('nookies');
import JWT from 'jsonwebtoken';
import { destroyCookie } from 'nookies';


export const authorizeToken = (req, res) => {
    const token = parseCookies({ req }).token;
    if(!token) return 'User not logged in.';
    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch(err) {
        // Clear cookie if it's expired or failed when decoded
        destroyCookie({ res }, 'token');
        return err.name
    }
}