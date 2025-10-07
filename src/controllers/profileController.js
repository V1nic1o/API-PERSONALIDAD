// src/controllers/profileController.js
const asyncHandler = require('express-async-handler');
const profileModel = require('../models/profileModel');
// Importamos nuestro nuevo servicio
const { calculateArchetype } = require('../services/profileService'); 

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  
  // 1. Obtenemos el perfil numérico de la base de datos
  const profile = await profileModel.getProfileByUserId(userId);
  if (!profile) {
    res.status(404);
    throw new Error('Perfil no encontrado.');
  }

  // 2. Usamos el servicio para calcular el arquetipo
  const archetype = calculateArchetype(profile);

  // 3. Enviamos una respuesta combinada al usuario
  res.status(200).json({
    profileData: profile,
    archetype: archetype,
  });
});

const getProfileHistory = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const history = await profileModel.getProfileHistoryByUserId(userId);
  res.status(200).json(history);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { firstName, lastName, dateOfBirth } = req.body;

  const dataToUpdate = {
    firstName,
    lastName,
    dateOfBirth,
  };

  // Si se subió un archivo, req.file existirá gracias a multer
  if (req.file) {
    dataToUpdate.profileImageUrl = req.file.path; // La URL segura de Cloudinary
  }

  const updatedUser = await profileModel.updateUserProfile(userId, dataToUpdate);

  if (!updatedUser) {
    return res.status(400).json({ message: 'No se proporcionaron datos para actualizar.' });
  }

  res.status(200).json(updatedUser);
});

module.exports = {
  getCurrentUserProfile,
  getProfileHistory,
  updateUserProfile,
};