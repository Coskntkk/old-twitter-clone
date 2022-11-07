import connectMongo from '../../../utils/connectMongo';
import User from '../../../models/user';

export default async function Login(req, res) {
    try {
        // POST request body
        if (req.method === 'POST') {
            login(req, res);
        }
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

const login = async (req, res) => {
    try {
        // Find user by email
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send({ success: false, message: 'Please enter all fields' });
            return;
        }
        await connectMongo();
        let user = await User.findOne({ email });
        // Check if user exists
        if (!user) {
            user = await User.findOne({ username: email });
        }
        if (user) {
            // Check if password is correct
            user.comparePassword(password, (err, isMatch) => {
                if (isMatch && !err) {
                    // Send JWT token
                    const token = user.generateJwt();
                    res.status(200).send({ success: true, token });
                } else {
                    res.status(401).send({ success: false, message: 'Incorrect password' });
                }
            });
        } else {
            // Redirect to login page if user doesn't exist
            res.status(400).send({success: false, message: 'User not found'});
        }
    } catch (err) {
        // Redirect to login page if error occurs
        res.status(400).send({success: false, message: err.message});
    }
}