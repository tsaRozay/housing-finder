module.exports = {
  environment: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8001,
  dbFile: './dev.db',
  jwtConfig: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
  },
};