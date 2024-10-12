const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const xmlHandler = require('./xmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const jsonUrlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/success': jsonHandler.success,
  '/badRequest': jsonHandler.badRequest,
  '/unauthorized': jsonHandler.unauthorized,
  '/forbidden': jsonHandler.forbidden,
  '/internal': jsonHandler.internal,
  '/notImplemented': jsonHandler.notImplemented,
  '/notFound': jsonHandler.notFound,
};

const xmlUrlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/success': xmlHandler.success,
  '/badRequest': xmlHandler.badRequest,
  '/unauthorized': xmlHandler.unauthorized,
  '/forbidden': xmlHandler.forbidden,
  '/internal': xmlHandler.internal,
  '/notImplemented': xmlHandler.notImplemented,
  '/notFound': xmlHandler.notFound,
};

const onRequest = (request, response) => {
  console.log(request.url);

  // first we have to parse information from the url
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  request.body = parsedUrl.searchParams.entries();

  // Then we route based on the path that the user went to
  if (request.headers.accept === 'text/xml') {
    if (xmlUrlStruct[parsedUrl.pathname]) {
      return xmlUrlStruct[parsedUrl.pathname](request, response);
    }

    return xmlHandler.notFound(request, response);
  }
  if (jsonUrlStruct[parsedUrl.pathname]) {
    return jsonUrlStruct[parsedUrl.pathname](request, response);
  }

  return jsonHandler.notFound(request, response);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`listening on 127.0.0.1:${port}`);
});
