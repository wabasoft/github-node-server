const config = require('config');
const { Octokit } = require("@octokit/core");
const organization = config.get('server.organization');
const token = config.get('server.token');
const octokit = new Octokit({auth: token});
const http = require('http');
const fs = require('fs');
const port=4567;
function isEmpty(obj) {
    return Object.keys(obj).length === 0 && (obj.constructor === Object || obj.constructor === undefined);
}
const server = http.createServer(function (request, response) {
    if (request.method === 'GET') {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream('./public/form.html', 'UTF-8').pipe(response);
    } else if (request.method === 'POST') {
        console.log('Now we have a http message with headers but no data yet.');
        let body = '';
        request.on('data', function (chunk) {
            body += chunk;
            //console.log('body:' + body);
        });
        console.log('Data object received in chunks.');
        request.on('end', function(){
            response.writeHead(200, { 'Content-Type': 'text/html' });
            const bodyJson = JSON.parse(body);
            //console.log('bodyJson:' + body);
            if (!isEmpty(bodyJson)) {
                const action = bodyJson.action;
                const repository_id = bodyJson.repository.id;
                const repository_name = bodyJson.repository.name;
                const repository_default_branch = bodyJson.repository.default_branch;
                const repository_full_name = bodyJson.repository.full_name;
                const repository_sender_login = bodyJson.sender.login;
                const repository_sender_id = bodyJson.sender.id;
                // GitHub octokit
                // Protect branch
                const protectBranch = async () => {
                    if (repository_default_branch !== undefined) {
                        await octokit.request(
                        'PUT /repos/' + organization + '/' + repository_name + '/branches/' + repository_default_branch + '/protection', {
                            owner: organization,
                            repo: repository_name,
                            branch: repository_default_branch,
                            required_status_checks: {
                                strict: false,
                                private: true,
                                contexts: []
                            },
                            enforce_admins: false,
                            required_pull_request_reviews: {},
                            restrictions: {
                                users: [
                                    'octocat'
                                ],
                                teams: [
                                    'justice-league'
                                ],
                                apps: [
                                    'super-ci'
                                ]
                            },
                            required_linear_history: true,
                            allow_force_pushes: true,
                            allow_deletions: true,
                            block_creations: true,
                            required_conversation_resolution: true,
                            lock_branch: true,
                            allow_fork_syncing: true
                        });
                    }
                 };
                // create issue
                const createIssue = async () => {
                    await octokit.request('POST /repos/' + organization + '/' + repository_name + '/issues', {
                        owner: repository_sender_login,
                        repo: repository_name,
                        title: 'default branch is unprotected',
                        body: 'I\'m protecting the branch.',
                        assignees: [
                            repository_sender_login
                        ],
                        labels: [
                            'bug'
                        ]
                    });
                }
                protectBranch().then(r => console.log('Branch protected... [OK]!'));
                createIssue().then(r => console.log('Issue created... [OK]!'));
            }
            //console.log('body: ' + body);
            response.end(body);
        });
    } else {
        console.log('Unhandled request');
    }
}).listen(port);
