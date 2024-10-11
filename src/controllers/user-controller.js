const { StatusCodes } = require('http-status-codes');
const { UserService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');



/**
 * 
 * POST :/signup
 * req-body {email:'@def.com' , password:"12234"}
 */
async function signup(req, res) {
    try {
        const user = await UserService.create({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user;
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse)
    }
}


async function signin(req, res) {
    try {
        const user = await UserService.signin({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user.jwt;
        return res
            .status(StatusCodes.CREATED)
            .cookie('token',
                SuccessResponse.data,
                {
                    httpOnly: true,
                    sameSite: 'None',
                    secure: true,
                    maxAge: 3600000
                })
            .json(user.userData);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse)
    }
}

async function firebaseSignIn(req, res) {
    try {
        //console.log(req.body);
        const token = req.body.token;
        return res.status(StatusCodes.OK)
            .cookie('firebase_token', token, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 3600000
            }).json({
                message:'cookie created'
            });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(error);
    }
}

async function signout(req, res) {
    try {
        return res.status(StatusCodes.OK)
            .cookie("token", '', {
                expires: new Date(0),
                httpOnly: true,
                sameSite: 'None',
                secure: true
            }).cookie("firebase_token", '', {
                expires: new Date(0),
                httpOnly: true,
                sameSite: 'None',
                secure: true
            }).json({
                message: "User logged out Successfully",
                success: true
            })
    } catch (error) {
        console.log(error);
    }
}

async function addRoleToUser(req, res) {
    try {
        const user = await UserService.addRoletoUser({
            role: req.body.role,
            id: req.body.id
        });
        SuccessResponse.data = user;
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse)
    }
}


module.exports = {
    signup,
    signin,
    signout,
    addRoleToUser,
    firebaseSignIn

}