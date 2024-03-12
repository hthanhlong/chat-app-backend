import  User  from '../database/model/User';
import { sign } from 'jsonwebtoken';
import { generateSalt } from '../utils';
import userRepository from '../repositories/userRepository';
class AuthService {
    async signup({
        username,
        email,
        password
    } : signUpInput) {
        const now = new Date();
        const user : Omit<User,'_id'>  =  {
            username,
            email,
            password,
            verified: true,
            isActive: true,
            salt : generateSalt(),
            createdAt: now,
            updatedAt: now
        }
        const result = await userRepository.createUser(user);
    }
}

export default new AuthService();