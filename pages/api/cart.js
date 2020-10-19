export default (req, res) => {
    switch(req.method) {
        case "POST":
            return handlePost(req, res);
        default:
            return res.status(402).json();
    }
}

const handlePost = async (req, res) => {
    console.log(req);
    res.json({hi:"hi"});
}