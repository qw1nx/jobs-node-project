const { Schema, model, Types: { ObjectId} } = require('mongoose');

//TODO change usermodel according to exam description
//TODO add validation
const EMAIL_PATTERN = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
const userSchema = new Schema({
    email: {type: String, validate: {
            validator(value){
                return EMAIL_PATTERN.test(value);
            },
            message: 'Email must be a valid'
        }, required: [true, 'Email is required']},
    hashedPassword: { type: String, required: [true, 'Password is required']},
    skills: {type: String, required: [true, 'Skills are required']},
    myPosts: {type: [ObjectId], ref: 'Post', default: []}
});


userSchema.index({email:1}, {
    unique:true,
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);
module.exports = User;