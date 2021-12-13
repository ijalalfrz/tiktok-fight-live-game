const express = require('express');
const port = process.env.PORT || 8080;
const app = express();
const cors = require('cors');

// Desactiva el header x-powered-by
app.disable("x-powered-by");
app.use(cors());
app.use(express.static(__dirname + "/dist/"));
app.get(/.*/, function(request, response){
    response.sendFile(__dirname + "/dist/index.html");
})
app.listen(port);

console.log('Servidor iniciado...')
