const http = require('http');
const config = require('config');
const { Octokit } = require("@octokit/core");
const organization = config.get('server.organization');
const token = config.get('server.token');
const repository = config.get('server.repository');
const octokit = new Octokit({auth: token});
const server = http.createServer ( function(request,response){
    response.writeHead(200,{"Content-Type":"text\plain"});
    if(request.method === "GET")
    {
        response.end("received GET request.")
        console.log(request);
    }
    else if(request.method === "POST")
    {
        response.end("received POST request.");
        const action = request.action;
        const repository_id = request.repository.id;
        const repository_name = request.repository.name;
        const repository_default_branch = request.repository.default_branch;
        const sender_login = request.sender.login;
        console.log(request);
    }
    else
    {
        response.end("Undefined request .");
    }
});

server.listen(4567);
console.log("Server running on port 4567");

// code here
const start = async (x, y) => {
    await Promise.resolve(octokit.request('POST /orgs/' + organization + '/repos', {
        org: organization,
        name: repository,
        description: 'This is your first repository',
        homepage: 'https://github.com',
        'private': false,
        has_issues: true,
        has_projects: true,
        has_wiki: true
    }));
    console.log('Repository ' + repository + ' created successfully.');
};
const a = 1;
const b = 2;
start(a, b,).then(r => console.log('then'));
