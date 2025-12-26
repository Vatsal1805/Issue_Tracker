const User=require('../models/User');

class UserRepository{
    async findByEmail(email){
        return await User.findOne({email});
    }

    async createUser(userData){
        return User.create(userData);
    }

    async findById(id){
        return User.findById(id).select('-password');
    }

    async updateById(id, updateData) {
        return User.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-password');
    }

    async deleteById(id) {
        return User.findByIdAndDelete(id).select('-password');
    }
}

module.exports=new UserRepository();

