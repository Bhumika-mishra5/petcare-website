const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const user = await User.create({ name, email, password });
    const token = signToken(user.id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          _id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (err) {
    console.error('Auth Error:', err);
    let message = err.message;
    if (err.name === 'SequelizeUniqueConstraintError') {
      message = 'This email is already registered. Please login instead.';
    } else if (err.name === 'SequelizeValidationError') {
      message = err.errors.map(e => e.message).join(', ');
    }
    
    res.status(400).json({
      status: 'fail',
      message: message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password!',
      });
    }

    let user = await User.findOne({ where: { email } });
    if (user && !(await user.comparePassword(password))) {
      user = null;
    }

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          _id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (err) {
    console.error('Auth Error:', err);
    let message = err.message;
    if (err.name === 'SequelizeUniqueConstraintError') {
      message = 'This email is already registered. Please login instead.';
    } else if (err.name === 'SequelizeValidationError') {
      message = err.errors.map(e => e.message).join(', ');
    }
    
    res.status(400).json({
      status: 'fail',
      message: message,
    });
  }
};
