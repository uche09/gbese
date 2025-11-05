import recordService from "../services/record_service.js"



export async function addRecord(req, res) {
    
    try {
        let {
            customerName,
            customerPhoneNumber,
            email,
            amount,
            payment,
            transactionType,
            dueDate,
            description
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
            email,
            amount,
            payment,
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
