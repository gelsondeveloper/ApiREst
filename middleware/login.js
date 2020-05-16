const jwt = require('jsonwebtoken');

exports.obrigatorio = (req, res, next) => {
    let key = 'segredo'; 

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, key);
        req.usuario = decode;
        next();
    
    } catch (error) {
     return res.status(401).send({ mensagem: 'Falha na Autenticação'})
    }
   
}


exports.opcional = (req, res, next) => {
    let key = 'segredo'; 

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, key);
        req.usuario = decode;
        next();
    
    } catch (error) {
     next();
    }
   
}