const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  // Vérifie si le header Authorization existe
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Si pas de token
  if (!token) {
    return res.status(401).json({
      message: "Accès refusé, token manquant"
    });
  }

  try {
    // Vérifie le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("HEADERS =", req.headers.authorization);

    // On stocke l'id utilisateur dans req.user
    req.user = decoded.id;

    next(); // passe à la suite
  } catch (error) {
    return res.status(401).json({
      message: "Token invalide"
    });
  }
};

module.exports = protect;