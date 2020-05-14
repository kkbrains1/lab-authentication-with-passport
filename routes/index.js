'use strict';

const { Router } = require('express');
const router = Router();

const routeGuard = require('./../middleware/route-guard');

router.get('/authentication/private', routeGuard, (req, res, next) => {
  console.log(req.user);
  res.render('authentication/private');
});

router.get('/', (req, res, next) => {
  res.render('index');
});



module.exports = router;
