const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (password.length < 8) {
  return res.status(400).json({
    message: "Le mot de passe doit contenir au moins 8 caractères."
  });
}

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Utilisateur déjà existant"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Utilisateur créé",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email ou mot de passe incorrect"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Email ou mot de passe incorrect"
      });
    }

    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
  message: "Connexion réussie",
  token,
  user: {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  }
});
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  register,
  login
};