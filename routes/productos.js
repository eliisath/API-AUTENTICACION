const express = require("express");
const route = express.Router();
const { requiredScopes } = require('express-oauth2-jwt-bearer');

//Simulamos base de datos.
let productos = [
    { id: 1, nombre: "Producto 1", precio: 10.99 },
    { id: 2, nombre: "Producto 2", precio: 19.99 },
    { id: 3, nombre: "Producto 3", precio: 5.99 },
];
//Lo que hacemos con el Scopes es dando permisos, agregamos este middleware antes de que se ejecute la siguiente funcion. 
route.get("/", requiredScopes("read:productos"), (req, res, next) => {
    try {
        res.json(productos);
    } catch (err) {
        next(err);
    }
});

//Obtener Producto por ID
route.get("/:id", requiredScopes("read:productos"), (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const producto = productos.find((p) => p.id === id);

        if (!producto) {
            const error = new Error("Porducto no encontrado");
            error.status = 404;
            throw error;
        }

        res.json(producto);
    } catch (err) {
        next(err);
    }
});

//Crear nuevo producto
route.post("/", requiredScopes("read:productos", "write:productos"), (req, res, next) => {
    try {
        const { nombre, precio } = req.body;

        const nuevoProducto = {
            id: productos.length + 1,
            nombre,
            precio,
        };

        productos.push(nuevoProducto);
        res.status(201).json(nuevoProducto);
    } catch (err) {
        next(err);
    }
});

//Actualizar producto existente
route.put("/:id", requiredScopes("read:productos", "write:productos"), (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { nombre, precio } = req.body

        const producto = productos.find((p) => p.id === id);

        if (!producto) {
            const error = new Error("Producto no encontrado");
            error.status = 404;
            throw error;
        }

        producto.nombre = nombre || producto.nombre;
        producto.precio = precio || producto.precio;

        res.json(producto);
    } catch (err) {
        next(err);
    }
});

//Eliminar producto
route.delete("/:id", requiredScopes("read:productos", "write:productos"), (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const index = productos.findIndex((p) => p.id === id);

        if (index === -1) {
            const error = new Error("Producto no encontrado");
            error.status = 404;
            throw error;
        }

        const productoEliminado = productos.splice(index, 1);
        res.json(productoEliminado[0]);
    } catch (err) {
        next(err);
    }
});

module.exports = route;