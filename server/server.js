var express = require('express'),
     path = require('path'),
     compression = require('compression'),
     proxy = require('http-proxy-middleware');

var port = 4000;
const app = express();

app.use(compression());

app.use("/app_static", express.static(path.join(__dirname, '../suche/app_static')));

if(process.env.NODE_ENV === "production"){
  proxy_port = 6060;
}
else {
  proxy_port = 8080;
}
app.use('/api', proxy({target: `http://localhost:${proxy_port}`, secure: false}));
app.use("/public", express.static(path.join(__dirname, '../api/public'), {fallthrough: false}));

app.get([ '/*' ], function(req, res) {
  res.sendFile(path.join(__dirname, '../suche/index.html'));
});

app.listen(port, () => {console.log("Listening on port " + port)});

 


