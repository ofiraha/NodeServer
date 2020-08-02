/**
 * Catch Errors Handler
 * Instead of using try{} catch(e) {} in each controller, we wrap the function in
 * catchErrors(), catch any errors they throw, and pass it along to our express middleware with next().
 */

module.exports.catchErrors = (fn) => {
    return function (request, response) {
          fn(request, response).catch(error => {
            if (error.response) {
              // The request was made, the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
              response.status(error.response.status).send({ message: error.response.data });
            } else if (error.request) {
              console.log(error.request);
              response.send({ message: "The request was made but no response was received" });
            } else {
              // Something happened in setting up the request 
              // that triggered an Error
              console.log('Error', error.message);
              response.send({ message: error.message });
            }
            console.log(error.config);
      });
    }
}