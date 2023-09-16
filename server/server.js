var express = require('express'),
    path = require('path'),
    compression = require('compression');
    const { createProxyMiddleware } = require('http-proxy-middleware');

var port = 4000;
const app = express();

app.use(compression());

app.listen(port);

app.use("/app_static", express.static(path.join(__dirname, '../app/app_static')));
// app.use('/api', proxy({target: 'http://localhost:6060', secure: false}));
app.use('/api', createProxyMiddleware({target: 'http://localhost:6060', secure: false}));
app.use("/public", express.static(path.join(__dirname, '../api/public'), {fallthrough: false}));

app.use((req, res, next) => {
  //res.append('Access-Control-Allow-Origin', ['*']);
  //res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use((req, res, next) => {
  if(req.url.length > 1 && req.url.match(/.*\/$/)){
    res.redirect(307, req.url.replace(/\/+$/, ""))
  } else {
    next();
  }
});

app.get([ '/*' ], function(req, res) {
	var host = req.get('host');
	
	if(host.indexOf('zuugle.si') >= 0) {
		res.sendFile(path.join(__dirname, '../app/index-si.html'));
	}
	else if(host.indexOf('zuugle.it') >= 0) {
		res.sendFile(path.join(__dirname, '../app/index-it.html'));
	}
	else if(host.indexOf('zuugle.fr') >= 0) {
		res.sendFile(path.join(__dirname, '../app/index-fr.html'));
	}
	else if(host.indexOf('zuugle.de') >= 0) {
		res.sendFile(path.join(__dirname, '../app/index-de.html'));
	}
	else if(host.indexOf('zuugle.ch') >= 0) {
		res.sendFile(path.join(__dirname, '../app/index-ch.html'));
	}
	else {
	  res.sendFile(path.join(__dirname, '../app/index.html'));
	}
});
