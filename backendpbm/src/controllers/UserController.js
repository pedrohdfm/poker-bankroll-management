import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

const authSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const register = async (req, res) => {
  try {
    const { error, value } = authSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, email, password } = value;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'nao foi possivel concluir o registro' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    res.status(201).json({
      message: 'registro com sucesso',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: 'server error!' });
  }
};

export const login = async (req, res) => {
    try {
        const { error, value } = authSchema
            .fork(['name'], (schema) => schema.optional())
            .validate(req.body);
    
        if(error) return res.status(400).json({error: error.details[0].message })

        const { email, password} = value;


        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({error: 'credenciais invalidas'})
        }

        const token = generateToken(user._id)

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.status(200).json({
            message: 'login realizado',
            user: { id: user._id, name: user.name, email: user.email }
        })
    } catch (err) {
        res.status(500).json({ error: 'server error!'})
    }
}

export const getProfile = (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  })
}

export const logout = (req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    })
    .status(200)
    .json({ message: 'Logout realizado com sucesso' })
}
