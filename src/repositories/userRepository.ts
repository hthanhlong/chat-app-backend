import User, { UserModel } from "../database/model/User";

class UserRepository {
    async createUser(user : Omit<User, '_id'>): Promise<{ user: User}> {
        const createdUser = await UserModel.create(user);
        return { user: { ...createdUser.toObject() }};
    }
}


export default new UserRepository();