const express = require('express');
const router = express.Router();

//Rota para buscar todos os pedidos
router.get('/', (req, res, next) => {
    res.status(200).send({
    mensagem: 'Usando o GET dentro da rota de pedidos'

    });
});

//Rota para Inserir um pedido 
router.post('/', (req, res, next) => {
    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    }
    res.status(201).send({
    mensagem: 'Usando o POST dentro da rota de pedidos',
    pedidoCriado: pedido

    });
});

//Rota para buscar um pedido por ID
router.get('/:id_pedido', (req, res, next) => {
const id = req.params.id_pedido;

res.status(200).send({
    mensagem: 'Detalhe do Pedido',
    id_pedido: id
});
});

//Rota para Alterar um pedido
// router.patch('/', (req, res, next) => {
//     res.status(201).send({
//         mensagem: 'Usnado o Patch dentro da rota de pedidos',
    
//     });
//     });

//Rota para Apagar um pedido
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando o Delete dentro da rota de pedidos'
    });
});

module.exports = router;