import Record from "../models/record.js";
import User from "../models/user.js";
import { Op } from "sequelize";

async function createRecord(record) {
    const nameExist = await Record.findOne({
        where: { 
            userId: record.userId,
            customerName: record.customerName,  
            beenCleared: false,
        }
    });


    if (nameExist) throw new Error("There is an unbalanced record with this name");

    let user = await User.findOne({ where: {id: record.userId}});

    // Insert record and make sure it's okay
    const newRecord = await Record.create(record);

    // Check if transaction is credit (lend) or personal debt (borrow)
    // Update user's statistics
    switch (record.transactionType) {
        case "lend":
            if (record.payment === null || record.amount > record.payment) {
                user.increment({
                    debtorCount: 1,
                    creditsGiven: record.amount,
                    creditPayments: record.payment ?? 0
                });

                await user.save();
            }
            break;

        case "borrow":
            // TODO
            break;
    }
    


    return newRecord;
}

export default { createRecord };