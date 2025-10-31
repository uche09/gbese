export default function errorHandler(err, req, res, next) { 
 console.error(err.stack);

 res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: err.data || null,
 });

 next();
}