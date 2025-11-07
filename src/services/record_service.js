import sequelize from "../config/db.js";
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

async function fetchAdminStatistics(whereClause, transactionType) {

    whereClause.transactionType = transactionType;
    whereClause.beenCleared = false;

    const stats = await Record.findAll({
        attributes: [
            [sequelize.fn('sum', sequelize.col('balance')), 'totalDebtOwed'],
            [sequelize.fn('sum', sequelize.col('amount')), "creditSales"],
            [sequelize.fn('sum', sequelize.col('payment')), "paymentReceived"],
            [sequelize.fn('count', sequelize.col("transactionType")), "activeDebtors"],
        ],

        where: whereClause,
        raw: true, // get object output instead of model instances
    });

    const overdueRecords = await Record.findOne({
        attributes: [[sequelize.fn('sum', sequelize.col('balance')), "overduePayments"]],
        where: {
            transactionType: transactionType,
            beenCleared: false,
            dueDate: {
                [Op.lt]: new Date()
            },
        },

        raw: true,
    });
    
    // if stats is null, add overdue statistics
    if (stats && stats[0]) {
        stats[0].overduePayments = overdueRecords?.overduePayments || 0;
    }

    return stats[0]; // findAll returns an array,
}


async function fetchUserRecord(whereClause) {

    const records = await Record.findAll({
        attributes: {
            exclude: ["userId"]
        },
        order: [["updatedAt", "DESC"]],

        where: whereClause,
        raw: true,
    });

    return records;
}



export default { 
    createRecord, fetchAdminStatistics, 
    fetchUserRecord, searchForRecord 
};