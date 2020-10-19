import { destroyCookie, parseCookies } from 'nookies';
export default (req, res) => {
    switch(req.method) {
        case "GET":
            return handleGet(req, res);
    }
}

const handleGet = (req, res) => {
    destroyCookie({ res }, "token")
    res.status(200).json({msg: 'no cookie now'});
}