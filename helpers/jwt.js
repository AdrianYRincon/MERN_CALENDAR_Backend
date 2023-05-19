const jwt = require('jsonwebtoken');

//aqui ponemos como parametros lo que queremos poner en el payload del JWT
const generarJWT = ( uid, name ) => {

  return new Promise( ( resolve, reject ) => {

    const payload = { uid, name };
    // payload - palabra-secreta - opciones, callback en caso de un error o si se pudo generar el JWT
    jwt.sign( payload, process.env.SECRET_JWT_SEED, {
      expiresIn: '2h'
    }, ( err, token) => {
      if( err){
        console.log(err)
        reject('No se pudo generar el token');
      }

      resolve( token );
      
    });



  })

}

module.exports = {
  generarJWT
};