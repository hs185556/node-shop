const express = require('express');
const router = express.Router();
const goods=require('./../controls/goods');

router.get('/goods-list', goods.getGoodsList);
router.get('/goods-count', goods.getGoodsCount);
router.post('/goods-detail', goods.getOneGoods);
router.post('/goods-add', goods.addGoods);
router.post('/goods-delete', goods.deleteGoods);
router.post('/goods-update', goods.updateGoods);
router.post('/admins-reg', goods.regAdmins);
router.post('/admins-login', goods.loginAdmins);

module.exports = router;