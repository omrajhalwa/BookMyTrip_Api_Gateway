const express = require('express');
const { ServerConfig , Logger } = require('./config');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const apiRoutes = require('./routes');
const app = express();

const limiter = rateLimit({
    
     windowMs: 2 * 60 * 1000, // 2 minutes
     max: 3  //Limit each IP to 3 requests per window
})

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(limiter);

app.use('/flightsService',
   createProxyMiddleware({
    target : ServerConfig.FLIGHT_SERVICE  ,
    changeOrigin:true ,
    pathRewrite: {'^flightsService' : '/'}}));
    
app.use('/bookingService',[f1,f2], createProxyMiddleware({target : ServerConfig.BOOKING_SERVICE  , changeOrigin:true}));


app.use('/api',apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`successfully started the server on PORT : ${ServerConfig.PORT}`);
      Logger.info('Successfully started the server','root',{})
})

function f1(req, res , next) {
    console.log("f1");
     next();
}

function f2(req, res, next) {
  console.log('f2');
   next();
}