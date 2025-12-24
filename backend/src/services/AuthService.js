const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');
const JWTUtil = require('../utils/jwt.util');
const ApiError=require('../errors/Apierror');

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
}

module.exports = AuthService;
