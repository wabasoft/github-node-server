const http = require('http');
const config = require('config');
const { Octokit } = require("@octokit/core");
const organization = config.get('server.organization');
const token = config.get('server.token');
const repository = config.get('server.repository');
const octokit = new Octokit({auth: token});
const server = http.createServer ( function(request,response){

    response.writeHead(200,{"Content-Type":"text\plain"});
    if(request.method == "GET")
    {
        response.end("received GET request.")
        console.log(request);
    }
    else if(request.method == "POST")
    {
        response.end("received POST request.");
        console.log(request);
    }
    else
    {
        response.end("Undefined request .");
    }
});

server.listen(4567);
console.log("Server running on port 4567");
