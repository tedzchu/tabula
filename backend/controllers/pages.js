const fs = require('fs');
const path = require('path');

const Page = require('../models/page');
const User = require('../models/user');

const getPages = async (req, res, next) => {
  const userId = req.userId;

  try {
    if (!userId) {
      const err = new Error('User is not authenticated.');
      err.statusCode = 401;
      throw err;
    }

    const user = await User.findById(userId);

    if (!user) {
      const err = new Error('Could not find user by id.');
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      message: 'Fetched pages successfully',
      pages: user.pages.map((page) => page.toString()),
    });
  } catch (err) {
    next(err);
  }
};

const getPage = async (req, res, next) => {
  const userId = req.userId;
  const pageId = req.params.pageId;

  try {
    const page = await Page.findById(pageId);
    if (!page) {
      const err = new Error('Could not find page by id');
      err.statusCode = 404;
      throw err;
    }

    const creatorId = page.creator ? page.creator.toString() : null;
    if ((creatorId && creatorId === userId) || !creatorId) {
      // include public pages
      res.status(200).json({
        message: 'Fetched page successfully',
        page: page,
      });
    } else {
      const err = new Error('User is not authenticated');
      err.statusCode = 401;
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

const postPage = async (req, res, next) => {
  const userId = req.userId;
  const blocks = req.body.blocks;
  const page = new Page({
    blocks: blocks,
    creator: userId || null,
  });
  try {
    const savedPage = await page.save();

    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        const err = new Error('Could not find user by id');
        err.statusCode = 404;
        throw err;
      }
      user.pages.push(savedPage._id);
      await user.save();
    }

    res.status(201).json({
      message: 'Created page successfully',
      pageId: savedPage._id.toString(),
      blocks: blocks,
      creator: userId || null,
    });
  } catch (err) {
    next(err);
  }
};

const putPage = async (req, res, next) => {
  const userId = req.userId;
  const pageId = req.params.pageId;
  const blocks = req.body.blocks;

  try {
    const page = await Page.findById(pageId);

    if (!page) {
      const err = new Error('Could not find page by id');
      err.statusCode = 404;
      throw err;
    }

    const creatorId = page.creator ? page.creator.toString() : null;
    if ((creatorId && creatorId === userId) || !creatorId) {
      page.blocks = blocks;
      const savedPage = await page.save();
      res.status(200).json({
        message: 'Updated page successfully.',
        page: savedPage,
      });
    } else {
      const err = new Error('User is not authenticated.');
      err.statusCode = 401;
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

const deletePage = async (req, res, next) => {
  const userId = req.userId;
  const pageId = req.params.pageId;

  try {
    const page = await Page.findById(pageId);

    if (!page) {
      const err = new Error('Could not find page by id.');
      err.statusCode = 404;
      throw err;
    }

    // can't delete public pages
    const creatorId = page.creator ? page.creator.toString() : null;
    if (creatorId && creatorId === userId) {
      const deletedPage = await Page.findByIdAndDelete(pageId);

      const user = await User.findById(userId);
      if (!user) {
        const err = new Error('Could not find user by id');
        err.statusCode = 404;
        throw err;
      }
      user.pages.splice(user.pages.indexOf(deletedPage._id), 1);
      await user.save();

      res.status(200).json({
        message: 'Deleted page successfully',
      });
    } else if (!creatorId) {
      const err = new Error('User is not authenticated');
      err.statusCode = 401;
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

exports.getPages = getPages;
exports.getPage = getPage;
exports.postPage = postPage;
exports.putPage = putPage;
exports.deletePage = deletePage;
