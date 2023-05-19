const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async( req, res = response ) => {

  const { email, password } = req.body
  
  try {

    //validamos si ya hay un usuario con ese correo
    let usuario = await Usuario.findOne({ email })
   
    if( usuario ){
      
      return res.status(400).json({
        ok:false,
        msg:'Un usuario existe con ese correo'
      });
    }

    //creamos una instancial del model Usuario
    usuario = new Usuario( req.body );

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt );

    //lo guardamos en la BD
    await usuario.save();

    //generamos el JWT
    const token = await generarJWT( usuario.id, usuario.name );

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    });


  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'Por favor hable con el administrador'
    });
  }
 

};


const loginUsuario = async( req, res = response ) => {

  const { email, password } = req.body;

  //validamos si ya hay un usuario con ese correo


  try {

    let usuario = await Usuario.findOne({ email })
  
    if( !usuario ){
      
      return res.status(400).json({
        ok:false,
        msg:'El usuario no existe con ese email'
      });
    }

    //confirmar los passwords
    const validPassword = bcrypt.compareSync( password, usuario.password );

    if ( !validPassword ){
      return res.status(400).json({
        ok: false,
        msg:'Password incorrecto'
      });
      
    }

    // generar nuestro JWT
    const token = await generarJWT( usuario.id, usuario.name );


    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    })

    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:'Por favor hable con el administrador'
    });
  }

 

}

const revalidadToken = async( req, res = response ) => {

 const { uid, name } = req;

  // Generar un JWT y retornarlo en esta peticion
  const token = await generarJWT(uid,name)

  res.json({
    ok:true,
    uid,
    name,
    token
  });
}



module.exports  = {
  crearUsuario,
  loginUsuario,
  revalidadToken
}