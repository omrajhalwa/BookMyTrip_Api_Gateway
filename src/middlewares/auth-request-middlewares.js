const { StatusCodes } = require('http-status-codes');

const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const { UserService } = require('../services')

function validateAuthRequest(req, res, next){
     
    if(!req.body.email) {
        ErrorResponse.message = 'Something went wrong while authenticating user';
        ErrorResponse.error = new AppError('Email not found in the incoming request in the correct form' ,StatusCodes.BAD_REQUEST);

        return res
                 .status(StatusCodes.BAD_REQUEST)
                 .json(ErrorResponse);
    }

    if(!req.body.password) {
        ErrorResponse.message = 'Something went wrong while authenticating user';
        ErrorResponse.error = new AppError('Password not found in the incoming request in the correct form' ,StatusCodes.BAD_REQUEST);

        return res
                 .status(StatusCodes.BAD_REQUEST)
                 .json(ErrorResponse);
    }

    next();
}

async function checkAuth(req, res, next) {

    try {
       // console.log(req.cookies.firebase_token);
    // const response =await UserService.isAuthenticated(req.headers['x-access-token']);
    const response_of_googleAuth = await UserService.firebaseAuthenticated(req.cookies.firebase_token);

    if(response_of_googleAuth){
        req.user = response_of_googleAuth;
       return  next();
    }

     const response_of_jwt = await UserService.isAuthenticated(req.cookies.token);
 
    
        if(response_of_jwt) {
            req.user = response_of_jwt; //setting the user id in the req object
            next();
        }
       
    } catch (error) {
        return res
                 .status(error.statusCode)
                 .json(error);
    }
}

async function isAdmin(req, res, next) {
    const response = await UserService.isAdmin(req.user);

    if(!response) {
        return res
                 .status(StatusCodes.UNAUTHORIZED)
                 .json({message: 'User not authorized for this action'});
    }

    next();
}
module.exports = {
    validateAuthRequest,
    checkAuth,
    isAdmin
}