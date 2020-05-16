const mysql = require('../mysql').pool;

//Buscar todos os Produtos 
exports.getProdutos = ((req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send ({ error: error }) }
        conn.query(
            'select * from produtos;',
            (error, resultado, fields) => {
                if(error) { return res.status(500).send ({ error: error }) }
                const response = {
                    quantidade: resultado.length,
                    produtos: resultado.map(prod =>{
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            imagem_produto: prod.imagem_produto,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto',
                                url: 'http://localhost:3000/produtos/'+ prod.id_produto 
                            }
                        }
                    })
                }
                return res.status(200).send({ response})
            }
            )
            
        });
        
    });
    
    //Salvar um produto 
    exports.salvarUmProduto = ((req, res, next) => {
        console.log(req.usuario);
        mysql.getConnection((error, conn) => {
            if(error) { return res.status(500).send ({ error: error }) }
            
            conn.query(
                'insert into produtos (nome, preco, imagem_produto) values (?,?,?)',
                [
                    req.body.nome, 
                    req.body.preco,
                    req.file.path
                ],
                
                (error, resultado, field) => {
                    conn.release();
                    if(error) { return res.status(500).send ({ error: error }) }
                    const response = {
                        mensagem: 'Produto Inserido com Sucesso',
                        produtoCriado:{
                            id_produto: resultado.id_produto,
                            nome: req.body.nome,
                            preco: req.body.preco,
                            imagem_produto: req.file.path,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os produtos',
                                url: 'http://localhost:3000/produtos/'
                            }
                        }
                    }
                    return res.status(201).send({ response})
                    
                }
                )
            });
            
            
            
        });
        
        //Buscar um produto por Id
        exports.buscarUmProduto = ((req, res, next) => {
            mysql.getConnection((error, conn) =>{
                
                if(error) { return res.status(500).send ({ error: error }) }
                conn.query(
                    'select * from produtos where id_produto= ?;',
                    [req.params.id_produto],
                    (error, resultado, fields) => {
                        if(error) { return res.status(500).send ({ error: error }) }
                        if(resultado.length == 0) {
                            return res.status(404).send({
                                mensagem: 'Não foi encontrado produto com este ID'
                            })
                        }
                        const response = {
                            produto:{
                                id_produto: resultado[0].id_produto,
                                nome: resultado[0].nome,
                                preco: resultado[0].preco,
                                imagem_produto: resultado[0].imagem_produto,
                                request: {
                                    tipo: 'GET',
                                    descricao: 'Retorna um Produto',
                                    url: 'http://localhost:3000/produtos/'
                                }
                            }
                        }
                        return res.status(200).send({ response})
                        
                    }
                    )
                    
                });
            }); 
            
            //Alterar os dados do Produto
            exports.alterarProduto = ((req, res, next) => {
                mysql.getConnection((error, conn) => {
                    if(error) { return res.status(500).send ({ error: error }) }
                    
                    conn.query(
                        `update produtos 
                        set nome = ?, 
                        preco = ? 
                        where id_produto = ?
                        `,
                        [
                            req.body.nome, 
                            req.body.preco, 
                            req.body.id_produto],
                            (error, resultado, field) => {
                                conn.release();
                                if(error) { return res.status(500).send ({ error: error }) }
                                const response = {
                                    mensagem: 'Produto Atualizado com Sucesso',
                                    produtoAtualizado:{
                                        id_produto: req.body.id_produto,
                                        nome: req.body.nome,
                                        preco: req.body.preco,
                                        request: {
                                            tipo: 'GET',
                                            descricao: 'Retorna os detalhes de um produto específico',
                                            url: 'http://localhost:3000/produtos/' +req.body.id_produto
                                        }
                                    }
                                }
                                return res.status(202).send({ response});
                                
                            }
                            )
                        });
                    });
                    //Apagar Produtos 
                    exports.apagarProduto = ((req, res, next) => {
                        mysql.getConnection((error, conn) => {
                            if(error) { return res.status(500).send ({ error: error }) }
                            
                            conn.query(
                                'delete from produtos where id_produto = ?',
                                [req.body.id_produto],
                                (error, resultado, field) => {
                                    conn.release();
                                    if(error) { return res.status(500).send ({ error: error }) }
                                    const response = {
                                        mensagem: 'Produto Excluído com Sucesso',
                                        request: {
                                            tipo: 'POST',
                                            descricao: 'Insere um Produto',
                                            url: 'http://localhost:3000/produtos',
                                            body: {
                                                nome: 'string',
                                                preco: 'Number'
                                            }
                                        }
                                    }
                                    return res.status(202).send({
                                        response
                                        
                                    })
                                    
                                }
                                )
                            });
                        });