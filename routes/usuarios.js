const express = require('express');
const router = express.Router();
// const mysql = require('../mysql').pool;

 

//Conroller para Usuários 
const usuarioController = require('../controllers/usuarios.controller');

//Rota para o cadastro de usuário 
router.post('/cadastro', usuarioController.cadastroUsuario);

//Rota para o Login de usuário

router.post('/login', usuarioController.loginUsuario);

module.exports = router;