const http = require("http");
const url = require("url");

const bodyParser = require("./helpers/bodyParser");
const routes = require("./routes");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  console.log(
    `Request method: ${req.method} | Endpoint: ${parsedUrl.pathname}`
  );

  let { pathname } = parsedUrl;
  let id = null;

  const splitEndPoint = pathname.split("/").filter(Boolean);

  if (splitEndPoint.length > 1) {
    pathname = `/${splitEndPoint[0]}/:id`;
    id = splitEndPoint[1];
  }

  const route = routes.find(
    (routeObj) =>
      routeObj.endpoint === pathname && routeObj.method === req.method
  );

  if (route) {
    req.query = parsedUrl.query;
    req.params = { id };

    res.send = (statusCode, body) => {
      res.writeHead(statusCode, { "Content-Type": "text/html" });
      res.end(JSON.stringify(body));
    };

    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      bodyParser(req, () => route.handler(req, res));
    } else {
      route.handler(req, res);
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(`Cannot ${res.method} ${parsedUrl.pathname}`);
  }

  // if (req.url === "/users" && req.method === "GET") {
  //   listUsers(req, res);
  // } else {
  //   res.writeHead(200, { "Content-Type": "text/html" });
  //   res.end(`Cannot ${req.method} ${req.url}`);
  // }
});

server.listen(3000, () =>
  console.log("Server started at http://localhost:3000")
);
