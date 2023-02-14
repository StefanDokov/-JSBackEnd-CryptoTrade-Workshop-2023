const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jsonwebtoken');
const SECRET = 'SOMEDEVSECRET';

exports.findByUsername = (username) => User.findOne({username});
exports.findByEmail = (email) => User.findOne({email});

exports.register = async (username, email, password, rePassword) => {

    if (password !== rePassword) {
        throw new Error(`Password missmatch!`);
    }
   
   const existingUser = await User.findOne({$or: [
    {email},
    {username}
   ]});


   if (existingUser) {
    throw new Error('User already exists!');
   }

   if (password.length < 4) {
     throw new Error(`Password too short!`);
   }


   const hashPassword = await bcrypt.hash(password, 10);

   await User.create({ username, email, password: hashPassword});

   return this.login(email, password);
}

exports.login = async(email, password) => {

   const user = await this.findByEmail(email);

   if (!user) {
    throw new Error('Invalid email or password!');
   }

   const isValid = await bcrypt.compare(password,user.password);

   if (!isValid) {
    throw new Error('Invalid email or password!');
   }
   
   const payload = {_id: user._id, email, username: user.username}
   const token = await jwt.sign(payload, SECRET)


  return token;

}