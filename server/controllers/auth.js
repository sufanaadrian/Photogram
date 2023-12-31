import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const registerFunc = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      cameraBody,
      cameraLens,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      cameraBody,
      cameraLens,
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const loginFunc = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const credentialsMatch = await bcrypt.compare(password, user.password);
    if (!credentialsMatch)
      return res.status(400).json({ msg: "Invalid credentials. " });

    // Set the isAdmin flag based on the user's role
    const isAdmin = user.role === "admin";

    const token = jwt.sign({ id: user._id, isAdmin }, process.env.JWT_SECRET);
    delete user.password;

    // Return the isAdmin flag along with the token and user data
    res.status(200).json({ token, user, isAdmin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
