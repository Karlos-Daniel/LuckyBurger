const{ Router }= require('express');
const router = Router();

const {pruebasJson} = require('../controllers/pruebasJsonController');

router.post('/postPrueba',pruebasJson);

module.exports = router