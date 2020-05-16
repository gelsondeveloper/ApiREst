const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Cadastramento de Usuários 
exports.cadastroUsuario = ((req, res, next) => {
    mysql.getConnection((err, conn) => {
        if(err) { return res.status(500).send({ error: error }) }
        conn.query('select *from usuarios where email= ?', [req.body.email], (error, results)=> {
            if(error) { return res.status(500).send({ error: error }) }
            if(results.length > 0){
                return res.status(209).send({mensagem: 'Usuário já cadastrado'})
            }else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if(errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    conn.query('insert into usuarios(email, senha) values(?,?) ',
                    [req.body.email, hash],
                    (error, result) => {
                        conn.release();
                        if(error) { return res.status(500).send({ error: error }) }
                        response = {
                            mensagem: 'Usuário Criado com Sucesso',
                            usuarioCriado: {
                                id_usuario: result.insertId,
                                email: req.body.email
                            }
                        }
                        return res.status(201).send({response})
                    }
                    )
                });
            }
        })
        
        
    });
})

//Rota de Login 

exports.loginUsuario = ((req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({ error: error})}
        const query = 'select * from usuarios where email = ?';
        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release();
            if(error) {return res.status(500).send({ error: error})}
            if(results.length < 1) {
                return res.status(401).send({ mensagem: 'Falha na Autenticação'})
            }
            bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                if(err) {
                    return res.status(401).send({ mensagem: 'Falha na Autenticação'});
                }
                if(result) {
                    let key = 'segredo';
                    let token = jwt.sign({
                        id_usuario: results[0].id_usuario,
                        email: results[0].email
                    }, key, {
                        expiresIn: "1h"
                    })
                    return res.status(200).send({ 
                        mensagem: 'Autenticado com Sucesso!',
                        token: token
                    });
                }
                return res.status(401).send({ mensagem: 'Falha na Autenticação'})
            });
        });
    });
})