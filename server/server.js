var express = require('express'),
    path = require('path'),
    compression = require('compression'),
    proxy = require('http-proxy-middleware');

var port = 4000;
const app = express();

app.use(compression());

app.listen(port);

app.use("/app_static", express.static(path.join(__dirname, '../suche/app_static')));
app.use('/api', proxy({target: 'http://localhost:6060', secure: false}));
app.use("/public", express.static(path.join(__dirname, '../api/public'), {fallthrough: false}));

app.use((req, res, next) => {
  //res.append('Access-Control-Allow-Origin', ['*']);
  //res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get([ '/*' ], function(req, res) {
  res.sendFile(path.join(__dirname, '../suche/index.html'));
});