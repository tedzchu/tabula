const express = require('express');

const isAuth = require('../middleware/isAuth');
const pagesController = require('../controllers/pages');

const router = express.Router();

// GET /pages
router.get('/', isAuth, pagesController.getPages);

// GET /pages/{id}
router.get('/:pageId', isAuth, pagesController.getPage);

// POST /pages
router.post('/', isAuth, pagesController.postPage);

// PUT /pages/{id}
router.put('/:pageId', isAuth, pagesController.putPage);

// DELETE /pages/{id}
router.delete('/:pageId', isAuth, pagesController.deletePage);

module.exports = router;
