const {Router} = require ('express')
const{listDisney,listDisneyByID, addPeli, updatePeli, deletePeli, sigIn}=require('../controllers/Disney');


const router =Router();

//http://localhost:3000/api/v1/Disney/
//http://localhost:3000/api/v1/Disney/1
//http://localhost:3000/api/v1/Disney/3
router.get('/', listDisney);
router.get('/:id', listDisneyByID);
//router.post('/', sigIn);
router.put('/', addPeli);
router.patch('/:id', updatePeli);
router.delete('/:id', deletePeli);
module.exports =router;