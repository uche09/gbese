import User from "./user.js";
import RefreshToken from "./refresh_token.js";
import Record from "./record.js";

// Relationships
// User.hasMany(Record, {foreignKey: "userId"}),
Record.belongsTo(User, {foreignKey: "userId"}),
RefreshToken.belongsTo(User, {foreignKey: "userId"});


export default {User, RefreshToken, Record};