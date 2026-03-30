const express = require('express');

const authController = require('../controllers/auth');
const { check, body } = require('express-validator');
const router = express.Router();
const User = require('../models/user');
router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('please enter valid email')
      .custom((value, { req }) => {
        // if (value === 'test@test.com')
        //   throw new Error('This Email address is forbidden');
        // return true;
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('Email Already Exit');
          }
        });
      })
      .normalizeEmail(),
    body('password', 'please enter 5 char password')
      .isLength({ min: 5 })
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('password have to match');
          return true;
        }
        return true;
      }),
  ],
  authController.postSignup,
);

router.post('/logout', authController.postLogout);

module.exports = router;
