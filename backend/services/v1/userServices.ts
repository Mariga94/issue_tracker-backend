import UserModel, { IUser } from '../../models/v1/userModel';


export const updateUserProfile = async (userId: string, data: {}): Promise<IUser | unknown> => {
    try {
        const user = await UserModel.findByIdAndUpdate(userId, { ...data }, { new: true })
        return user;
    } catch (error: any) {
        throw new Error(error.message)
    }
}

export const getUser = async (id: string): Promise<IUser | any> => {
    try {
        const currentUser = await UserModel.findById(id);
        return currentUser
    } catch (error: any) {
        throw new Error(error.message)
    }
}

export const getUsers = async () => {
    try {
        const users = await UserModel.find().select('-password')
        return users;
    } catch (error: any) {
        throw new Error(error.message)
    }
}


export const getUserProperties = async (userId: string) => {
    if (!userId) {
        throw new Error('userId is required')
    }
    const properties = await UserModel.findById(userId);
    return properties
}
