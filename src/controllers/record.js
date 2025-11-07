import dayjs from "dayjs";
import { Op } from "sequelize";
import { default as recordService } from "../services/record_service.js";



export async function addRecord(req, res) {
    
    try {
        let {
            customerName, customerPhoneNumber,
            email, amount, payment,
            transactionType, dueDate, description
        } = req.body;

        const user = req.user;

        if (!customerPhoneNumber) {
            customerPhoneNumber = null;
        }

        if (!email) {
            email = null;
        }

        if (!payment) {
            payment = null;
        }
        

        await recordService.createRecord({
            userId: user.id, 
            customerName, 
            customerPhoneNumber,
            email, amount, payment,
            transactionType,
            dueDate: Date.parse(dueDate),
            description,
        });

        return res.status(201).json({
            success: true,
            message: "Added new record"
        });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message || "Registration Failed"});
    }
    
}



export async function getUserRecords(req, res) {
    const { type, start, end } = req.query;
    
    let whereClause = {};
    whereClause.userId = req.user.id;
    whereClause.beenCleared = false;

    if (type) {
        whereClause.transactionType = type;
    }

    // checking for requested Record range
    if (start && end) {
        const startDate = dayjs(start).startOf("days").toDate();
        const endDate = dayjs(end).endOf("days").toDate();

        whereClause.createdAt = {
            [Op.between]: [startDate, endDate],
        };
    } else if (start) {
        const startDate = dayjs(start).startOf("days").toDate();

        whereClause.createdAt = {
            [Op.eq]: startDate,
        };
    }

    try {
        const record = await recordService.fetchUserRecord(whereClause);

        return res.status(200).json({
            success: true,
            statistics: record,
        });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message || "Registration Failed"});
    }
    
}