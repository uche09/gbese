import User from "../models/user.js";


async function createUser(userData) {
    const emailExists = await User.findOne({
        where: { email: userData.email },
    });

    if (emailExists) throw new Error("Email already exist");

    const newUser = await User.create(userData);

    return newUser;
}


async function userDashboard(whereClause) {
    const stats = await User.findOne({
        attributes: [
            ['creditsGiven', 'totalCreditGiven'],
            ["outstanding_credits", "outstanding"],
            ["debtorCount", "activeDebtors"],
            ["creditPayments", "totalPayment"],
        ],

        where: whereClause,
        raw: true
    });

    return stats;
}
export { createUser, userDashboard };