// src/controllers/authController.js
const asyncHandler = require('express-async-handler');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Usamos asyncHandler para envolver nuestra lógica
const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await userModel.findUserByEmail(email);
  if (existingUser) {
    res.status(409);
    throw new Error('El correo electrónico ya está registrado.');
  }

  const newUser = await userModel.createUser(email, password);
  res.status(201).json({ message: 'Usuario registrado con éxito.', user: { id: newUser.id, email: newUser.email } });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findUserByEmail(email);
  if (!user) {
    res.status(401);
    throw new Error('Credenciales inválidas.');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    res.status(401);
    throw new Error('Credenciales inválidas.');
  }
  
  const payload = { userId: user.id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ message: 'Inicio de sesión exitoso.', token: token });
});

module.exports = {
  registerUser,
  loginUser,
};