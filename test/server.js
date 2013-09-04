var express = require("express"),
    http = require("http"),
    path = require("path"),
    app = express()

app.set('port', 9999);
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, '..', 'test/fixtures/app')));

app.use(app.router);


app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port') + ' in environment ' + app.get('env'));
});