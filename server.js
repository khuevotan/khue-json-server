// See https://github.com/typicode/json-server#module
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
// Add this before server.use(router)
server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id'
}))



// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
    req.body.updatedAt = Date.now()
  } else if(req.method === 'PATCH'){
    req.body.updatedAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})


// Custom output for LIST
router.render = (req, res) => {
  // check GET with pagination
  // if yes, custom output

  const headers = res.getHeaders();

  const totalCountHeader = headers['x-total-count'];
  if(req.method === 'GET' && totalCountHeader){
    const queryParams = queryString.parse(req._parsedUrl.query);
    console.log(queryParams);


    const result = {
      data: res.locals.data,
      pagination: {
        _page: Number.parseInt(queryParams._page) || 10,
        _limit: Number.parseInt(queryParams._limit) || 10,
        _totalRows: Number.parseInt(totalCountHeader),
      },
    }; 

    return res.jsonp(result);
  }


  res.jsonp(res.locals.data);
};


server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server
