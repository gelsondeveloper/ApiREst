const express = require('express');
const router = express.Router();
// const mysql = require('../mysql').pool;
const multer = require('multer');
//Para proteção  da rotas
const login = require('../middleware/login');
// Controller de produtos 
const produtosController = require('../controllers/produtos.controller');

const storage= multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null,new Date().toDateString() + file.originalname)
    }
}); 

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else {
        cb(null, false);
    }
    
    
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024 * 5
    },
    fileFilter: fileFilter
});

//Rota para buscar todos os produtos
router.get('/', produtosController.getProdutos);

//Rota para Inserir um produto 
router.post('/',login.obrigatorio, upload.single('produto_imagem'), produtosController.salvarUmProduto);
//Rota para buscar um produto por ID
router.get('/:id_produto', produtosController.buscarUmProduto)

//Rota para Alterar um produto
router.patch('/',login.obrigatorio, produtosController.alterarProduto);

//Rota para Apagar um produto
router.delete('/',login.obrigatorio, produtosController.apagarProduto);

module.exports = router;