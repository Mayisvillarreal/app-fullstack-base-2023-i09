//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;
var express = require('express');
var cors = require("cors");
var corsOptions = {origin:"*",optionsSuccessStatuss:200};


var app     = express();
app.use(cors(corsOptions));

var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================
app.get("/otraCosa/:id/:algo",(req,res,next)=>{
    console.log("id",req.params.id)
    console.log("algo",req.params.algo)
    utils.query("select * from Devices where id="+req.params.id,(err,rsp,fields)=>{
        if(err==null){
            
            console.log("rsp",rsp);
            res.status(200).send(JSON.stringify(rsp));
        }else{
            console.log("err",err);
            res.status(409).send(err);
        }
        
        //console.log(fields);
    });
    
});

//________________________________________________________________
// Obtener los dispositivos de la base de datos
// _______________________________________________________________
app.get('/devices/', function(req, res, next) {
    utils.query('SELECT * FROM Devices', function(err,rsp) {
        if (err) {
            res.send(err).status(400);
            return;}
            else {
                res.send(JSON.stringify(rsp)).status(200);}
            }
            );
});
//________________________________________________________________
// Agregar un nuevo dispositivo
// _______________________________________________________________

app.post('/devices/', function(req, res, next) {
    utils.query('INSERT INTO `Devices` (`name`, `description`, `state`, `type`) VALUES (?, ?, ?, ?)',
        [req.body.name, req.body.description, req.body.state, req.body.type],
        function(err, rsp) {
            if (err) {
                res.send(err).status(400);
                return;}
                else {
            res.send({ 'id': rsp.insertId }).status(201);}
        }
    );
});

//________________________________________________________________
//   Eliminar un dispositivo
//_______________________________________________________________

app.delete('/devices/:id', function(req, res, next) {
    utils.query('DELETE FROM Devices WHERE id = ?',req.params.id,
        function(err) {
            if (err) {
                res.send(err).status(400);
                return;}
                else {
            res.send("deleted").status(200);
        }
    }
    );
});
    
   

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});


//=======[ End of file ]=======================================================
