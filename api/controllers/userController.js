const { User } = require('../models');

// Profile User
exports.profile = async (req, res) => {
  try {
    const userId = req.user.id; // ID user dari token JWT
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};