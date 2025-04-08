import { Encrypter } from "../core/common/helper.js";
import { UserModel } from "../models/user.js";
export const addUser = async (req) => {
    // const EncrypterService = new Encrypter()
    let { email, password } = req?.body
    password = Encrypter.encrypt(password)
    const UserSchema = new UserModel({
        email, password
    })
    return await UserSchema.save()
};