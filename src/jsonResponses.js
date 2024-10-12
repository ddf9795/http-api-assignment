const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  // Set up headers
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  };

  // Print the contents of the response
  console.log(content);

  // send response with json object
  response.writeHead(status, headers);

  // HEAD requests don't get a body back, just the metadata.
  // So if the user made one, we don't want to write the body.
  if (request.method !== 'HEAD') {
    response.write(content);
  }

  response.end();
};

// Successful response
const success = (request, response) => {
  const responseJSON = {
    message: 'This is a successful response',
  };

  respondJSON(request, response, 200, responseJSON);
};

// Bad Response
const badRequest = (request, response) => {
  const searchParams = Array.from(request.body).flat(Infinity);

  let valid;

  // Check for a 'valid' query
  for (let index = 0; index < searchParams.length; index++) {
    const param = Array.from(searchParams)[index];
    if (param === 'valid') {
      valid = searchParams[index + 1];
    }
  }

  let responseJSON;

  // If valid is true, return 200
  if (valid === 'true') {
    responseJSON = {
      message: 'This is a successful response',
    };
    respondJSON(request, response, 200, responseJSON);
    return;
  }
  // Otherwise, return 400
  responseJSON = {
    message: 'Missing valid query parameter set to true',
    id: 'badRequest',
  };
  respondJSON(request, response, 400, responseJSON);
};

// Unauthorized
const unauthorized = (request, response) => {
  const searchParams = Array.from(request.body).flat(Infinity);

  let loggedIn;

  // Check for a 'loggedIn' query
  for (let index = 0; index < searchParams.length; index++) {
    const param = Array.from(searchParams)[index];
    if (param === 'loggedIn') {
      loggedIn = searchParams[index + 1];
    }
  }
  let responseJSON;

  // If loggedIn is yes, return 200
  if (loggedIn === 'yes') {
    responseJSON = {
      message: 'This is a successful response',
    };
    respondJSON(request, response, 200, responseJSON);
    return;
  }
  // Otherwise, return 401
  responseJSON = {
    message: 'Missing loggedIn query parameter set to yes',
    id: 'unauthorized',
  };
  respondJSON(request, response, 401, responseJSON);
};

// Forbidden
const forbidden = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };

  respondJSON(request, response, 403, responseJSON);
};

// Internal server error
const internal = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  respondJSON(request, response, 500, responseJSON);
};

// Not implemented
const notImplemented = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplmeneted',
  };

  respondJSON(request, response, 501, responseJSON);
};

// Not found
const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
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
