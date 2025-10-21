/**
 * Middleware para verificar se o usuário tem um dos tipos permitidos
 * @param  {...number} allowedTypes - Lista de userType permitidos
 */
const authorize =
  (...allowedTypes) =>
  (req, res, next) => {
    if (!req.user || !req.user.userType) {
      return res.status(403).json({
        success: false,
        message: "Usuário não autenticado ou sem tipo definido",
      });
    }

    // Admin (tipo 0) tem acesso a tudo
    if (req.user.userType === 0) {
      return next();
    }

    // Verifica se o tipo do usuário está permitido
    if (allowedTypes.includes(req.user.userType)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Nível de acesso insuficiente",
    });
  };

/**
 * Middleware alternativo para verificar roles específicos
 * (mantido caso queira usar nomes de funções específicas)
 * @param {Array<number>} roles
 */
const requireRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.userType)) {
    return res.status(403).json({
      success: false,
      message: "Nível de acesso insuficiente",
    });
  }
  next();
};

module.exports = authorize;
