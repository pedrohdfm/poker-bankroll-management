import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token

    if (!token) {
      return res.status(401).json({ message: 'não autorizado' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({ message: 'usuário inválido' })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'token inválido ou expirado' })
  }
}
