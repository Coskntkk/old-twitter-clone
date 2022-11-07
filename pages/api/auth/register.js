import connectMongo from '../../../utils/connectMongo';
import User from '../../../models/user';

export default async function Register(req, res) {
    try {
        // POST request body
        if (req.method === 'POST') {
            register(req, res);
        }

    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

const register = async (req, res) => {
    try {
        if (!req.body.username || !req.body.password || !req.body.email) {
            res.status(400).send({ success: false, message: 'Please fill all fields' });
            return;
        }
        await connectMongo();
        // Check if user already exists
        const sameUsername = await User.findOne({ username: req.body.username });
        const sameEmail = await User.findOne({ email: req.body.email });
        if (sameUsername || sameEmail) {
            res.status(400).send({ success: false, message: 'Email or username already exists' });
            return;
        }
        // Create a new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            image: `${Math.ceil(Math.random() * 5) + 1}.png`,
        });
        await newUser.save();
        // Redirect to login page
        res.status(201).send({success: true, message: 'User created successfully'});
    } catch (err) {
        // Go back if error occurs
        console.log(err);
        res.status(400).send({success: false, message: err.message});
    }
};