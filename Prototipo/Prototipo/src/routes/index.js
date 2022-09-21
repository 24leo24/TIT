const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/', async (rep,res)=>{
    const persona = await pool.query('SELECT * FROM persona');
    console.log(persona);
    res.render('home');
});

module.exports = router;