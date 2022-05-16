const { hash, compare } = require('bcrypt');
const User = require('../models/user');

// TODO add all fields required by the exam
async function register(email, password, skills){
    const existing = await getUserByUsername(email);

    if(existing){
        throw new Error('Username is taken');
    }

    const hashedPassword = await hash(password, 10);

    const user = new User({
        email,
        hashedPassword,
        skills
    });
    await user.save();

    return user;
}


//TODO change identifier
async function login(email, password){
    const user = await getUserByUsername(email);

    if(!user){
        throw new Error('User doesn\'t exist');
    }
    const hasMatch = await compare(password, user.hashedPassword);

    if(!hasMatch){
        throw new Error('Incorrect email or password')
    }

    return user;
}

//TODO identify user by given identifier
async function getUserByUsername(email){
    return await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
}

async function getEmailById(id){
    const user = await User.findById(id);
    return user.email;
}

async function listOfApplicants(arrApplicantsId){
    const result = [];
    for(let applicantId of arrApplicantsId){
        const user = await User.findById(applicantId);
        result.push({email: user.email, skills: user.skills});
    }
    return result;
}



module.exports = {
    login,
    register,
    getEmailById,
    listOfApplicants
}