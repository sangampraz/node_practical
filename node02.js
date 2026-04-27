const http = require("http");
const url = require("url");

const port = 3000;

// Simple in-memory data just for demo purposes
let friends = [
  { id: 1, firstName: "George", lastName: "Kristoferson", phone: "2062062066" },
  { id: 2, firstName: "Bill", lastName: "Madison", phone: "4254254255" }
];

// Helper: send JSON response
function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data, null, 2));
}

// Helper: collect request body
function getRequestBody(request, callback) {
  let body = "";

  request.on("data", chunk => {
    body += chunk.toString();
  });

  request.on("end", () => {
    callback(body);
  });
}

const server = http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const path = parsedUrl.pathname;
  const method = request.method;

  console.log(`${method} ${path}`);

  // Basic home route
  if (path === "/" && method === "GET") {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Node server is running");
    return;
  }

  // GET /friends
  if (path === "/friends" && method === "GET") {
    sendJson(response, 200, friends);
    return;
  }

  // GET /friends/:id
  if (path.startsWith("/friends/") && method === "GET") {
    const id = parseInt(path.split("/")[2], 10);
    const friend = friends.find(f => f.id === id);

    if (!friend) {
      sendJson(response, 404, { error: "Friend not found" });
      return;
    }

    sendJson(response, 200, friend);
    return;
  }

  // POST /friends
  if (path === "/friends" && method === "POST") {
    getRequestBody(request, body => {
      try {
        const newFriend = JSON.parse(body);

        const nextId =
          friends.length > 0
            ? Math.max(...friends.map(f => f.id)) + 1
            : 1;

        newFriend.id = nextId;
        friends.push(newFriend);

        sendJson(response, 201, {
          message: "Friend created",
          friend: newFriend
        });
      } catch (error) {
        sendJson(response, 400, { error: "Invalid JSON body" });
      }
    });
    return;
  }

  // PUT /friends/:id
  if (path.startsWith("/friends/") && method === "PUT") {
    const id = parseInt(path.split("/")[2], 10);

    getRequestBody(request, body => {
      try {
        const updatedData = JSON.parse(body);
        const index = friends.findIndex(f => f.id === id);

        if (index === -1) {
          sendJson(response, 404, { error: "Friend not found" });
          return;
        }

        friends[index] = { ...friends[index], ...updatedData, id };

        sendJson(response, 200, {
          message: "Friend updated",
          friend: friends[index]
        });
      } catch (error) {
        sendJson(response, 400, { error: "Invalid JSON body" });
      }
    });
    return;
  }

  // DELETE /friends/:id
  if (path.startsWith("/friends/") && method === "DELETE") {
    const id = parseInt(path.split("/")[2], 10);
    const index = friends.findIndex(f => f.id === id);

    if (index === -1) {
      sendJson(response, 404, { error: "Friend not found" });
      return;
    }

    const deletedFriend = friends.splice(index, 1)[0];

    sendJson(response, 200, {
      message: "Friend deleted",
      friend: deletedFriend
    });
    return;
  }

  // If no route matches
  sendJson(response, 404, { error: "Route not found" });
});

server.listen(port, () => {
  console.log(`Server running at port :${port}/`);
});