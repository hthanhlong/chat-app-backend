import { Request , Response} from "express";

export const signupController = async (req: Request, res : Response) => {
    const { username, email, password } = req.body;
    







    res.status(200).json({ message: 'User created successfully 2' });

  }