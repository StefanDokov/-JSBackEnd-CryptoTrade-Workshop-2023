const router = require('express').Router();
const {isAuthorized} = require('../middlewares/authMiddleware');
const cryptoManager = require('../managers/cryptoManager');
const {getErrorMessage} = require('../utils/errorUtils');
const {getPayMetodata} = require('../utils/viewDataUtils');


router.get('/catalog', async(req, res) => {
    const allCrypto = await cryptoManager.getAll().lean();
    res.render('catalog', {allCrypto});
});

router.get('/create', isAuthorized, (req, res) => {
    res.render('offerts/create');
});

router.post('/create',isAuthorized, async(req, res) => {

 const cryptoData = req.body;
try{
   await cryptoManager.create(req.user._id, cryptoData);
} catch(err){
    return res.status(400).render('offerts/create', {err: getErrorMessage(err)});
}
   res.redirect('/catalog');
 
});

router.get('/details/:cryptoId', async(req, res) => {
    const crypto = await cryptoManager.getOne(req.params.cryptoId).lean();
      
     
     const isOwner = crypto.owner == req.user?._id;
     const isBuyer = crypto.buyers.some(id => id == req.user?._id);

    res.render('offerts/details', {crypto, isOwner, isBuyer});
});

router.get('/buy/:cryptoId', isAuthorized, async(req, res) => {
   await cryptoManager.buy(req.user._id, req.params.cryptoId);
   
   res.redirect('/catalog');
});

router.get('/edit/:cryptoId', isAuthorized,async (req, res) => {
    const crypto = await cryptoManager.getOne(req.params.cryptoId).lean();
    
   const payMethods = getPayMetodata(crypto.payMethod);

    res.render('offerts/edit', {crypto, payMethods});

});

router.post('/edit/:cryptoId',async (req, res) => {
   const cryptoData = req.body;
    try {
    await cryptoManager.update(req.params.cryptoId, cryptoData);
    } catch(err) {
        return res.status(400).render('404', {err: getErrorMessage(err)});
    }
    res.redirect('/catalog');
});

router.get('/delete/:cryptoId', async(req, res) => {
   
    await cryptoManager.delete(req.params.cryptoId);
    res.redirect('/catalog');
});

router.get('/search', async (req, res) => {
   const {name, payMethod} = req.query; 
   const crypto = await cryptoManager.search(name, payMethod);
   res.render('search', {crypto});
});



module.exports = router;