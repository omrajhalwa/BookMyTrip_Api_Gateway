const express = require('express');
const { ServerConfig , Logger } = require('./config');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./routes');
const app = express();

const limiter = rateLimit({
    
     windowMs: 2 * 60 * 1000, // 2 minutes
     max: 3  //Limit each IP to 3 requests per window
})

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(limiter);
app.use('/api',apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`successfully started the server on PORT : ${ServerConfig.PORT}`);
      Logger.info('Successfully started the server','root',{})
})

