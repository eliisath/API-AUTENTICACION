const express = require("express");
const { auth } = require('express-oauth2-jwt-bearer');

const productosRouter = require("./routes/productos")

const errorHandler = require ("./middleware/errorHandler") 

const jwtCheck = auth({
    audience: 'https://localhost:3000/api/productos',
    issuerBaseURL: 'https://dev-lkfqum3zbxve2law.us.auth0.com/',
    tokenSigningAlg: 'RS256'
  });

const app = express();

//Tiene que estar definido para que funcion el POST y transforme el HTML a JSON
app.use(express.json())

//Validar en todas las rutas
//app.use(jwtCheck)

//Ruta Base
app.get("/", (req, res) => {
    res.send("API de productos");
});

//Ruta productos
app.use("/api/productos", jwtCheck, productosRouter)

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API de producto escuchando en el puerto ${PORT}`);
});