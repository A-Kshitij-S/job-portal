import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
             console.log("❌ No token found in cookies", req.cookies);
            return res.status(400).json({
                message: "User not authenticated",
                success: false
            });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY); // use verify, not decode

        if (!decode) {
            return res.status(400).json({
                message: "Invalid token",
                success: false
            });
        }

        req.id = decode.id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Authentication failed",
            success: false
        });
    }
};

export default isAuthenticated;
