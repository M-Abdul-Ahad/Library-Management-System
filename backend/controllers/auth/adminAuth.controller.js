import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminModel from '../../models/admin.model.js';
import sequelize from '../../models/index.js';

const Admin = AdminModel(sequelize);

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const admin = await Admin.findOne({ where: { Email } });

    if (!admin) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(Password, admin.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken({  email: admin.Email });

    res.status(200).json({
      token,
      admin: {
        email: admin.Email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
