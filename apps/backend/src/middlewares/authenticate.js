
//  export default (req, res, next) => {
//      const authorizationHeader = req.headers['authorization'];
//      if ((authorizationHeader && authorizationHeader === "FV69pR5PQQLcQ4wuMtTSqKqyYqf5XEK4")) {
//          next();
//      } else {
//          res.status(403).json({
//              error: "not authenticated"
//          });
//      }
//  }

 export default (req, res, next) => { next(); }
