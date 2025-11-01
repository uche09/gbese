import User from "./user.js";
import RefreshToken from "./refresh_token.js";

// Relationships
RefreshToken.belongsTo(User, {foreignKey: "userId"});

export default {User, RefreshToken};