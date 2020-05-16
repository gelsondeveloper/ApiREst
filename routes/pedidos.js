const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
//Controllers 
const PedidosController = require('../controllers/pedidos.controller');

//Rota para buscar todos os pedidos
router.get('/', PedidosController.getPedidos);

//Rota para Inserir um pedido 
router.post('/',PedidosController.postPedidos);

//Rota para buscar um pedido por ID
router.get('/:id_pedidos', PedidosController.getUmPedido);


//Rota para Apagar um pedido
router.delete('/', PedidosController.apagarPedido);



module.exports = router;