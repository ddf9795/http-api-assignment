const respondXML = (request, response, status, object) => {
  let content = '<response>';

  for (let index = 0; index < Object.entries(object).length; index++) {
    content += `<${Object.entries(object)[index][0]}>${Object.entries(object)[index][1]}</${Object.entries(object)[index][0]}>`;
  }

  content += '</response>';

  console.log(content);

  // Headers contain our metadata. HEAD requests only get
  // this information back, so that the user can see what
  // a GET request to a given endpoint would return. Here
  // they would see what format of data (JSON) and how big
  // that data would be ('Content-Length')
  const headers = {
    'Content-Type': 'text/xml',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  };

  // send response with json object
  response.writeHead(status, headers);

  // HEAD requests don't get a body back, just the metadata.
  // So if the user made one, we don't want to write the body.
  if (request.method !== 'HEAD') {
    response.write(content);
  }

  response.end();
};

const success = (request, response) => {
  const responseXML = {
    message: 'This is a successful response',
  };

  respondXML(request, response, 200, responseXML);
};

const badRequest = (request, response) => {
  const searchParams = Array.from(request.body).flat(Infinity);

  let valid;

  for (let index = 0; index < searchParams.length; index++) {
    const param = Array.from(searchParams)[index];
    if (param === 'valid') {
      valid = searchParams[index + 1];
    }
  }

  let responseXML;

  if (valid === 'true') {
    responseXML = {
      message: 'This is a successful response',
    };
    respondXML(request, response, 200, responseXML);
    return;
  }
  responseXML = {
    message: 'Missing valid query parameter set to true',
    id: 'badRequest',
  };
  respondXML(request, response, 400, responseXML);
};

const unauthorized = (request, response) => {
  const searchParams = Array.from(request.body).flat(Infinity);

  let loggedIn;

  for (let index = 0; index < searchParams.length; index++) {
    const param = Array.from(searchParams)[index];
    if (param === 'loggedIn') {
      loggedIn = searchParams[index + 1];
    }
  }
  let responseXML;

  if (loggedIn === 'yes') {
    responseXML = {
      message: 'This is a successful response',
    };
    respondXML(request, response, 200, responseXML);
    return;
  }
  responseXML = {
    message: 'Missing loggedIn query parameter set to yes',
    id: 'unauthorized',
  };
  respondXML(request, response, 401, responseXML);
};

const forbidden = (request, response) => {
  // create error message for response
  const responseXML = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };

  respondXML(request, response, 403, responseXML);
};

const internal = (request, response) => {
  // create error message for response
  const responseXML = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  respondXML(request, response, 500, responseXML);
};

const notImplemented = (request, response) => {
  // create error message for response
  const responseXML = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplmeneted',
  };

  respondXML(request, response, 501, responseXML);
};

const notFound = (request, response) => {
  // create error message for response
  const responseXML = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondXML(request, response, 404, responseXML);
};

// set public modules
module.exports = {
  notFound,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
};
