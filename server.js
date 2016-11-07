'use strict';
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const todo = [
	{id: 0, text: 'Midterms are near', complited: false},
	{id: 1, text: 'Prepare for the midterms fools', complited: false},
	{id: 2, text: 'Good luck', complited: false}
];
let todonextitemid = todo.length;

const hw = function (req, res) {

	if (req.url === '/') 
		req.url = '/index.html';

    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const method = req.method;

//Return filtered JSON/array to client
    if(method === 'GET') {
        if(req.url.indexOf('/todo') === 0) {
            res.setHeader('Content-Type', 'application/json');
            let localTodo = todo;

            if(parsedQuery.searchtext) {
                localTodo = localTodo.filter(function(itm) {
                    return itm.text.toLowerCase().indexOf(parsedQuery.searchtext.toLowerCase()) >= 0;
                });
            };
            return res.end(JSON.stringify(localTodo));
        };
    };

//Add new item to JSON/array
    if(method === 'POST') {
        if(req.url.indexOf('/todo') === 0) {

            // read the content of the message
            let body = '';
            req.on('data', function (dataitem) {
                body += dataitem;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body); // Convert JSON to Javascript object
                jsonObj.id = todonextitemid;
                todonextitemid ++;
                todo[todo.length] = jsonObj;

                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(jsonObj)); // Covert Javascript object to JSON
            });
            return;
        };
    };

//Change any item
    if(method === 'PUT') {
        if(req.url.indexOf('/todo') === 0) {
            // read the content of the message
            let body = '';
            req.on('data', function (dataitem) {
                body += dataitem;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body); 
                for(let i = 0; i < todo.length; i++) {
                    if(todo[i].id === jsonObj.id) {
                        todo[i] = jsonObj;
                        res.setHeader('Content-Type', 'application/json');
                        return res.end(JSON.stringify(jsonObj));
                    };
                };

                res.statusCode = 404;
                return res.end('Data was not found and can therefore not be updated');
            });
            return;
        }
    }

// Detele item
    if (method === 'DELETE') {
        if (req.url.indexOf('/todo') === 0) {
            const id = req.url.substr(6);
            for(let i = 0; i < todo.length; i++) {
                if (id === todo[i].id+'') {
                    todo.splice(i, 1);
                    res.statusCode = 200;
                    return res.end('Successfully removed');
                }
            };
            res.statusCode = 404;
            return res.end('Can not delete item')
        }
    }

    fs.readFile('./public'+req.url, function(e, d){
	    if (e) {
     	  res.statusCode = 404;
	      res.write("404 Error: " + e);
	      res.end('');
		}
    	res.statusCode = 200;
	    return res.end(d);
		
	  }
	);
	
};

const srv = http.createServer(hw);
srv.listen(3001);