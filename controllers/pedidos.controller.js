const mysql = require('../mysql').pool;

//Busca todos os pedidos 
exports.getPedidos = ( (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send ({ error: error }) }
        conn.query(
            `select pedidos.id_pedidos,
            pedidos.quantidade,
            produtos.nome,
            produtos.preco 
            from pedidos
            inner join produtos 
            on produtos.id_produto = pedidos.id_produto;`,
            (error, resultado, fields) => {
                if(error) { return res.status(500).send ({ error: error }) }
                const response = {
                    pedidos: resultado.map(pedido =>{
                        return {
                            id_pedido: pedido.id_pedidos,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produto: pedido.id_produto,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um pedido específico',
                                url: 'http://localhost:3000/pedidos/' +pedido.id_pedidos 
                            }
                        }
                    })
                }
                return res.status(200).send({ response})
            }
            )
            
        });
    });
//Salva Um Pedido 
    exports.postPedidos = ((req, res, next) => {
        
        mysql.getConnection((error, conn) => {
            if(error) { return res.status(500).send ({ error: error }) }
            conn.query(
                'select * from produtos where id_produto = ?',
                [req.body.id_produto],
                (error, resultado, field) => {
                    if(error) { return res.status(500).send ({ error: error }) }
                    if(resultado.length == 0){
                        return res.status(404).send({
                            mensagem: 'Produto não encontrado'
                        })
                    }
                    conn.query(
                        'insert into pedidos (id_produto, quantidade) values (?,?)',
                        [req.body.id_produto, req.body.quantidade],
                        (error, resultado, field) => {
                            conn.release();
                            if(error) { return res.status(500).send ({ error: error }) }
                            const response = {
                                mensagem: 'Pedido Inserido com Sucesso',
                                pedidoCriado:{
                                    id_pedido: resultado.id_pedido,
                                    id_produto: req.body.nome,
                                    quantidade: req.body.quantidade,
                                    request: {
                                        tipo: 'GET',
                                        descricao: 'Retorna todos os pedidos',
                                        url: 'http://localhost:3000/pedidos/'
                                    }
                                }
                            }
                            return res.status(201).send({ response})
                            
                        }
                        )
                        
                    }
                    )
                    
                });
            });
//Busca um pedido por ID
            exports.getUmPedido = ( (req, res, next) => {
                mysql.getConnection((error, conn) =>{
                    
                    if(error) { return res.status(500).send ({ error: error }) }
                    conn.query(
                        'select * from pedidos where id_pedidos= ?;',
                        [req.params.id_pedidos],
                        (error, resultado, fields) => {
                            if(error) { return res.status(500).send ({ error: error }) }
                            if(resultado.length == 0) {
                                return res.status(404).send({
                                    mensagem: 'Não foi encontrado pedido com este ID'
                                })
                            }
                            const response = {
                                produto:{
                                    id_pedido: resultado[0].id_produtos,
                                    id_produto: resultado[0].id_produto,
                                    quantidade: resultado[0].quantidade,
                                    request: {
                                        tipo: 'GET',
                                        descricao: 'Retorna um Pedido',
                                        url: 'http://localhost:3000/pedidos/'
                                    }
                                }
                            }
                            return res.status(200).send({ response})
                            
                        }
                        )
                        
                    });
                });


        
//Apagar Pedido

exports.apagarPedido = ((req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send ({ error: error }) }
        
        conn.query(
            'delete from pedidos where id_pedidos = ?',
            [req.body.id_pedidos],
            (error, resultado, field) => {
                conn.release();
                if(error) { return res.status(500).send ({ error: error }) }
                const response = {
                    mensagem: 'Pedido Excluído com Sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um Pedido',
                        url: 'http://localhost:3000/pedidos',
                        body: {
                            id_produto: 'number',
                            quantidade: 'number'
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
    