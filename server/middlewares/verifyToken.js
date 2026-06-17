import jwt from "jsonwebtoken";

export const verifyAccessToken = async (req, res, next) => {
	try {
		const authorizationHeader = req.get("authorization");

		if (!authorizationHeader ||authorizationHeader.split(" ")[0] !== "Bearer") {
			return res
				.status(401)
				.json({
					success: false,
					message: "Authentication scheme must be Bearer",
				});
		}
        const accessToken = authorizationHeader.split(" ")[1];
        const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET);


        req.user = decodedAccessToken;
        next();

	} catch (error) {
		console.log("Error in verifyToken middleware", error);

		if(error.name === "TokenExpiredError"){
			return res.status(401).json({success: false, message: "Token expired"})
		}
		if(error.name === "JsonWebTokenError"){
			return res.status(401).json({success: false, message: "Invalid token"})
		}

		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};
