const express = require('express');
const { ServerConfig , Logger } = require('./config');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const {AuthRequestMiddlewares} = require('./middlewares')
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes');
const cors = require('cors')
const app = express();


const limiter = rateLimit({
    
     windowMs: 2 * 60 * 1000, // 2 minutes
     max: 30  //Limit each IP to 10 requests per window
})

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(limiter);
app.use(cors({
  origin:['http://localhost:3002','https://5a34a90e.bookmytrip.pages.dev'],
  credentials:true
}));

app.use(cookieParser());

app.use('/flightsService',
   createProxyMiddleware({
    target : ServerConfig.FLIGHT_SERVICE  ,
    changeOrigin:true ,
    pathRewrite: {'^flightsService' : '/'}}));
    
app.use('/bookingService',[AuthRequestMiddlewares.checkAuth], createProxyMiddleware({target : ServerConfig.BOOKING_SERVICE  , changeOrigin:true, on:{
   proxyReq:function(proxyReq,req,res) {
    if (req.body) {
      console.log(req.user);
      console.log(req.body);
      const bodyData = JSON.stringify(req.body);
      // Ensure the proxy request is updated with the proper headers
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.setHeader('emailid', req.user);
      // Write the body to the proxy request
      console.log(bodyData);
      proxyReq.write(bodyData);
    }
   }
}}));


app.use('/api',apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`successfully started the server on PORT : ${ServerConfig.PORT}`);
      Logger.info('Successfully started the server','root',{});
     
})

function f1(req, res , next) {
 
    
     next();
}

function f2(req, res, next) {
  console.log(req.user);
   next();
}