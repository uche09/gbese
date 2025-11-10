import { Op } from "sequelize";
import { userDashboard } from "../services/user_service.js"


async function statistics(req, res) {
    
    let whereClause = {};
    whereClause.id = req.user.id;

    try {
        const stats = await userDashboard(whereClause);

        return res.status(200).json({
            success: true,
            statistics: stats,
        });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message || "Failed to get dashboard data"});
    }
}

export default { statistics };