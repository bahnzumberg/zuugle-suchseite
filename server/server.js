var express = require('express'),
    path = require('path'),
    compression = require('compression'),
    proxy = require('http-proxy-middleware');

var port = 4000;
const app = express();

app.use(compression());

app.listen(port, () => {console.log("Listening on port " + port)});

app.use("/app_static", express.static(path.join(__dirname, '../suche/app_static')));
if(process.env.NODE_ENV === "production"){
  proxy_port = 6060;
}else {
  proxy_port = 8080;

}
app.use('/api', proxy({target: `http://localhost:${proxy_port}`, secure: false}));
app.use("/public", express.static(path.join(__dirname, '../api/public'), {fallthrough: false}));
// console.log:
// console.log('path to public folder from server :',path.join(__dirname, '../api/public'))
// console.log("target " , `http://localhost:${proxy_port}`)

// redundant legacy code
// since we are doing the corsConfig on the backend server "zuugle-api" so we do not need to set cors headers here
// app.use((req, res, next) => {
//   res.append('Access-Control-Allow-Origin', ['*']);
//   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.append('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

app.get([ '/*' ], function(req, res) {
  res.sendFile(path.join(__dirname, '../suche/index.html'));
});