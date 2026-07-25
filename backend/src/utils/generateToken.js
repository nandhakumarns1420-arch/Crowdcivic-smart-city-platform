import jwt from 'jsonwebtoken';

const generateToken = (userOrId) => {
  const user = typeof userOrId === 'object' ? userOrId : { _id: userOrId };
  const id = user._id?.toString?.() || user.id || userOrId;

  return jwt.sign({
    id,
    email: user.email,
    role: user.role
  }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export default generateToken;
