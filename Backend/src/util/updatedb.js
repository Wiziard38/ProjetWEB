const userModel = require('../models/users.js')
const tagModel = require('../models/tags.js');

// Ajouter ici les nouveaux require des nouveaux modèles

// eslint-disable-next-line no-unexpected-multiline
(async () => {
  // Regénère la base de données
  await require('../models/database.js').sync({ force: true })

  console.log('Base de données créée.')
  // Initialise la base avec quelques données
  const mat = await userModel.create({
    username: 'MatMatxxBG'
  })

  const jl = await userModel.create({
    username: 'DarkJL'
  })

  const osef = await tagModel.create({
    name: 'osef'
  })

  const alBatar = await tagModel.create({
    name: 'alBatar'
  })

  const alBatar2 = await tagModel.create({
    name: 'alBatar2'
  })

  await mat.addTags(osef)
  await jl.addTags(alBatar)
  await mat.addTags(alBatar2)
  // Ajouter ici le code permettant d'initialiser par défaut la base de donnée
})()
