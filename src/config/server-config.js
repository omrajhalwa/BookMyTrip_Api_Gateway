const dotenv = require("dotenv");

// give specific path of dotenv existing file......
dotenv.config({
    path:".env"
});

// console.log(process.env.PORT);
module.exports = {
    PORT:process.env.PORT,
    SALT_ROUNDS:process.env.SALT_ROUNDS
}