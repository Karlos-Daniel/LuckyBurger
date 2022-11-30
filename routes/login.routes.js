const{ Router }= require('express');
const {login}=require('../controllers/loginController');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('correo','El correo es obligatorio').isEmail(),
    check('password','La contraseña es obligatorio').not().isEmpty(),
    validarCampos
],login);

module.exports = router;