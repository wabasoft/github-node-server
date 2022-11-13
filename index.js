const config = require('config');
const { Octokit } = require("@octokit/core");
const organization = config.get('server.organization');
const token = config.get('server.token');
const octokit = new Octokit({auth: token});
const http = require('http');
const url = require('url');
const queryString = require( "querystring" );

const express = require('express');
const req = require("express/lib/request");
const app = express();

function isEmpty(obj) {
    return Object.keys(obj).length === 0 && (obj.constructor === Object || obj.constructor === undefined);
}


const server = http.createServer ( function(request,response){
    response.writeHead(200,{"Content-Type":"text\plain"});
    console.log('Request method: ' + request.method);
    if(request.method === "GET") {
        response.end("received GET request.")
        //console.log(request);
    }
    else if(request.method === "POST") {

        // parses the request url
        const theUrl = url.parse( request.url );
        // gets the query part of the URL and parses it creating an object
        const queryObj = queryString.parse( theUrl.query );
        if (!isEmpty(queryObj)){
            // queryObj will contain the data of the query as an object
            // and jsonData will be a property of it
            // so, using JSON.parse will parse the jsonData to create an object
            const obj = JSON.parse(queryObj.jsonData);
            // as the object is created, the live below will print "bar"
            console.log(obj.foo);
        }
        console.log('Now we have a http message with headers but no data yet.');
        const chunks = [];
        request.on('data', chunk => chunks.push(chunk));
        request.on('end', () => {
            const data = Buffer.concat(chunks);
            console.log('Data in chunks concatenated: ', data);
        });
        const URLParams = url.parse(request.url, true).query;
        if (!!URLParams) {
            console.log(URLParams);
        } else {
            console.log('URL Params undefined');
        }
        console.log('received POST request.');
        /* const action = request.action;
        if (action === 'created') {
            const repository_id = request.repository.id;
            const repository_name = request.repository.name;
            const repository_default_branch = request.repository.default_branch;
            const sender_login = request.sender.login;
            // create issue
            const CreateIssue = async () => {
                await Promise.resolve(octokit.request('POST /repos/' + organization + '/' + repository_name + '/issues', {
                    owner: sender_login,
                    repo: repository_name,
                    title: 'Repository created',
                    body: 'I\'m having a problem with this.',
                    assignees: [
                        'octocat'
                    ],
                    milestone: 1,
                    labels: [
                        'bug'
                    ]
                }));
            }
            CreateIssue().then(r => console.log('then'))
        }*/
        response.end("received POST request.");
    }
    else {
        response.end("Undefined request .");
    }
});
server.listen(4567);
console.log("Server running on port 4567");
