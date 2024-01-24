import UserModel from '../../models/v1/userModel'
import { createWorkspace } from '../../services/v1/workspaceServices';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const signUp = async (req: Request, res: Response): Promise<any> => {
    try {
        const { fullName, email, password } = req.body;
        console.log(req.body)

        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields in the request body' })
        }

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists' })
        }
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // create new User
        const newUser = new UserModel({ fullName, email, password: hashedPassword });
        await newUser.save();
        const userNamePlusWorkspace = newUser.fullName + ' ' + 'private';
        const newWorkspace = await createWorkspace(newUser._id, userNamePlusWorkspace)
        await newWorkspace.save();

        return res.status(201).json({ message: "User registered successfully" })
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
}


const signIn = async (req: Request, res: Response): Promise<any> => {
    try {

        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        } else {
            const passwordMatch = await bcrypt.compare(password, user?.password)
            if (!passwordMatch) {
                return res.status(401).json({ error: "Invalid credentials" })
            } else {
                const token = jwt.sign(
                    {
                        email: user.email,
                        userId: user._id,
                        fullName: user.fullName,
                    },
                    process.env.JWT_KEY!
                );
                // const { email, _id, ...info } = user._doc;
                return res
                    .cookie("token", token, {
                        httpOnly: true,
                        sameSite: "none",
                        secure: true,
                    })
                    .status(200)
                    .send({
                        email: user.toObject().email,
                        _id: user.toObject()._id,
                        fullName: user.toObject().fullName,
                    });
            }
        }
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

const signOut = async (req: Request, res: Response) => {
    res.cookie('token', '', { expires: new Date(0), httpOnly: true, secure: true, sameSite: 'none' });
    res.status(200).json({ message: 'Logout successful' })
}

export { signIn, signOut, signUp }