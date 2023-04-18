const router = require('express').Router()
router.use(require('./user'))
router.use(require('./partie'))
module.exports = router
