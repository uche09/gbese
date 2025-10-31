import User from "../models/user.js";


async function createUser(userData) {
    const emailExists = await User.findOne({
        where: { email: userData.email },
    });

    if (emailExists) throw new Error("Email already exist");

    const newUser = await User.create(userData);

    return newUser;
}

export { createUser };