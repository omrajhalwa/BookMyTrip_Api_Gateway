const express = require('express');

const { UserController } = require('../../controllers');
const { AuthRequestMiddlewares } = require('../../middlewares');
const router = express.Router();


router.post('/signup',
    AuthRequestMiddlewares.validateAuthRequest,
    UserController.signup
)

router.post('/signin',
    AuthRequestMiddlewares.validateAuthRequest,
    UserController.signin
)

router.post('/firebase-signin',
    UserController.firebaseSignIn
)

router.get('/signout',
    UserController.signout
)

router.post('/role',
    AuthRequestMiddlewares.checkAuth,
    AuthRequestMiddlewares.isAdmin,
    UserController.addRoleToUser
)


module.exports = router;