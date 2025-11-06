import dayjs from "dayjs";
import { Op } from "sequelize";
import { default as record } from "../services/record_service.js";

async function adminStats(req, res) {
    const { start, end } = req.query;

    let whereClause = {};

    // checking for requested statistic range
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
        const statistics = await record.fetchAdminStatistics(whereClause, "lend");

        return res.status(200).json({
            success: true,
            statistics: statistics,
        });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message || "Registration Failed"});
    }
    
}


export default { adminStats }