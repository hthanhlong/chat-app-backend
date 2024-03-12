import { sign } from 'jsonwebtoken';
class AuthService {
    async signup(username, email, password) {
        const user = await User.create({ username, email, password });
        const token = await JWT.encode({ _id: user._id });
        return token;
    }

}