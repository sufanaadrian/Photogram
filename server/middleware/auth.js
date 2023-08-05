import jwt from "jsonwebtoken";

//authorization routers regarding token

export const verifyWithToken = async (req, res, next) => {
  try {
    let verifyWithToken = req.header("Authorization");

    if (!verifyWithToken) {
      return res.status(403).send("Access Denied");
    }

    if (verifyWithToken.startsWith("Bearer ")) {
      verifyWithToken = verifyWithToken.slice(7).trimLeft();
    }

    const verifiedToken = jwt.verify(verifyWithToken, process.env.JWT_SECRET);
    req.user = verifiedToken;
    console.log(verifiedToken);
    // Check if the user is an admin
    if (req.user.isAdmin !== true) {
      return res.status(403).json({
        message: "You are not authorized to access this functionality.",
      });
    }

    next();
  } catch (err) {
    //500 internal server error
    res.status(500).json({ error: err.message });
  }
};
