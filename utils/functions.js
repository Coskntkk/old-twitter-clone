import jwt from 'jsonwebtoken';

const getUserFromToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded._id;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export { getUserFromToken };