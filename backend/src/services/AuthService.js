const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');
const JWTUtil = require('../utils/jwt.util');
const ApiError=require('../errors/Apierror');
const notificationService = require('./notification.service');

class AuthService {

    async register(userData) {
        const{username,email,password}=userData;
        const existingUser = await UserRepository.findByEmail(email);

        if (existingUser) {
            throw new ApiError(400, 'User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserRepository.createUser({
            username,
            email,
            password: hashedPassword
        });

        await notificationService.sendWelcomeNotification(newUser);

        const token = JWTUtil.generateToken({ id: newUser._id });
        return { user: newUser, token };
    }


async login(userData) {
    const { email, password } = userData;
    const user = await UserRepository.findByEmail(email);
    if (!user) {
        throw new ApiError(400, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(400, 'Invalid email or password');
    }
    const token = JWTUtil.generateToken({ id: user._id });
    return { user, token };
    }
async getCurrentUser(userId){
    if(!userId){
        throw new ApiError(401,'User not authenticated');
    }
    const user = await UserRepository.findById(userId);
    if(!user){
        throw new ApiError(404,'User not found');
    }
    return user;
}

async updateProfile(userId, updateData) {
    if(!userId){
        throw new ApiError(401,'User not authenticated');
    }
    
    const { username, email, password } = updateData;
    const updateFields = {};
    
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (password) {
        updateFields.password = await bcrypt.hash(password, 10);
    }
    
    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, 'No valid fields to update');
    }
    
    const updatedUser = await UserRepository.updateById(userId, updateFields);
    if (!updatedUser) {
        throw new ApiError(404, 'User not found');
    }
    
    return updatedUser;
}
}

module.exports = AuthService;
