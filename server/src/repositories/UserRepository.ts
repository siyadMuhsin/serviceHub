import User,{IUser} from "../models/Usermodel";

class UserRepository {
    async createUser(userData:Partial<IUser>) :Promise<IUser> {
        return await User.create(userData)
    } 
    async findUserByEmail(email:string):Promise<IUser|null>{
    return await User.findOne({email})
    }
    async findUserById(id:string):Promise<IUser|null>{
        return await User.findById(id)
    }
    async findUserAndUpdate(email: string, update: Partial<IUser>): Promise<IUser | null> {
        return User.findOneAndUpdate({ email }, update);
    }
    async findOneBYToken(token:string):Promise<IUser | null>{
        return User.findOne({resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }})

    }
    
}
export default new UserRepository()