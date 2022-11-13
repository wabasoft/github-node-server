const config = require('config');
const { Octokit } = require("@octokit/core");
const organization = config.get('server.organization');
const token = config.get('server.token');
const octokit = new Octokit({auth: token});
const http = require('http');
const url = require('url');

const express = require('express');
const req = require("express/lib/request");
const app = express();


const server = http.createServer ( function(request,response){
    response.writeHead(200,{"Content-Type":"text\plain"});
    console.log(request.method);
    if(request.method === "GET") {
        response.end("received GET request.")
        //console.log(request);
    }
    else if(request.method === "POST") {

        console.log('Now we have a http message with headers but no data yet.');
        request.on('data', chunk => {
            console.log('A chunk of data has arrived: ', chunk);
        });
        request.on('end', () => {
            console.log('No more data');
        });

        const URLParams = url.parse(request.url, true).query;
        console.log(URLParams);

        response.end("received POST request.");
        console.log("received POST request.");
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
    }
    else {
        response.end("Undefined request .");
    }
});
server.listen(4567);
console.log("Server running on port 4567");
