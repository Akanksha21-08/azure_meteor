const jwt = require('jsonwebtoken');

const getSecret = () => process.env.JWT_SECRET || 'super_secret_jwt_key_job_portal_2026_safe';
const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET || (getSecret() + '_refresh');

const generateAccessToken = (id) => {
  return jwt.sign({ id }, getSecret(), {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m'
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, getRefreshSecret(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  });
};

const generateToken = (id) => {
  return jwt.sign({ id }, getSecret(), {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

const setAuthCookies = (res, token, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/api/auth',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
  }
};

const clearAuthCookies = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/api/auth'
  });
};

module.exports = {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  getSecret,
  getRefreshSecret
};
