const jwt = require('jsonwebtoken');

const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'chargeslot_super_secret_jwt_key_2026_secure_random', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'chargeslot_super_secret_jwt_key_2026_secure_random');
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken({
    id: user._id,
    role: user.role,
    email: user.email,
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('token', token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    token,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        preferredVehicle: user.preferredVehicle,
      },
    },
  });
};

module.exports = {
  signToken,
  verifyToken,
  sendTokenResponse,
};
