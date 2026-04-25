const http = require('http');
const PORT = process.env.PORT || 3000;

// Assignment: Test friends2.json and other-friends.json
var friends = require("./data/friends.json"); // Once for all times

const server = http.createServer((request, response) => {
    response.statusCode = 200;     // html code 200 means everything is ok
    response.setHeader('Content-type', 'text/html');
    response.write(
        '<!DOCTYPE html> \n' +
        '<html lang="en"> \n' +
        '        <head> \n' +
        '               <meta charset="utf-8"> \n' +
        '               <meta name="viewport" content="width=device-width, initial-scale=1"> \n' +
        '               <meta name="description" content="Home Page"> \n' +
        '               <meta name="author" content="Carlos Arias"> \n' +
        '               <title>Node App 01</title> \n' +
        '               <!-- Bootstrap core CSS --> \n' +
        '               <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">\n' +
        '       </head> \n' +
        '        <body> \n' +
        '               <div class="container" style="text-align: center"> \n' +
        '               <h1>Another Example of Node</h1><br> \n'

    );
    var currentDate = new Date();
    response.write(
        '               <p>Current time is: ' + currentDate + '</p>'
    );
    response.write(
        '               <table class="table table-bordered table-hover"> \n' +
        '                       <thead> \n' +
        '                               <tr> \n' +
        '                                       <th scope="col">First Name</th> \n' +
        '                                       <th scope="col">Last Name</th> \n' +
        '                                       <th scope="col">Phone</th> \n' +
        '                               </tr> \n' +
        '                       </thead> \n' +
        '                       <tbody> \n'
    );
    for (var key in friends)
            for (var f in friends[key])
                response.write(
                    '                               <tr> \n' +
                    '                                       <td>' + friends[key][f]["firstName"] + '</td> \n' +
                    '                                       <td>' + friends[key][f]["lastName"] + '</td> \n' +
                    '                                       <td>' + friends[key][f]["phone"] + '</td> \n' +
                    '                               </tr> \n'
                );

    response.write(
        '                       </tbody> \n' +
        '               </table> \n'
    );
    response.write(
        '       </body> \n' +
        '</html> \n'
    );
    response.end();
});

server.listen(PORT, () => {
    console.log(`Server running at port ${PORT}/`);
});
