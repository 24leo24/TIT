const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'contrasena',
    passReqToCallback: true
}, async (req, correo, contrasena, done) => {
    
    const rows = await pool.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(contrasena, user.contrasena);
        if (validPassword) {
            done(null, user, req.flash('success', 'Bienvenido a LECOFQ'));
        } else {
            done(null, false, req.flash('message', 'Contraseña Incorrecta.'));
        }
    }
    else {
        return done(null, false, req.flash('message', 'No existe ese correo.'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'contrasena',
    passReqToCallback: true
}, async (req, correo, contrasena, done) => {
  
    const { rut } = req.body;
    const newUser = {
        rut,
        correo,
        contrasena,
        codigo_tip_usa: "1",
        codigo_estado: "1",
    };
    newUser.contrasena = await helpers.encryptPassword(contrasena);
    const result = await pool.query('INSERT INTO usuario SET ?', [newUser]);
    return done(null, newUser);
  }));
  
  passport.serializeUser((usuario, done) => {
    done(null, usuario.rut);
  });
  
  passport.deserializeUser(async (rut, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE rut = ?', [rut]);
    done(null, rows[0]);
  });