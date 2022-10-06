const https = require("https");
module.exports = {
  analyzeImage: (url, type) => {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ url });
      const options = {
        method: "POST",
        host: process.env.HOST_URL_ANALYZE,
        path: process.env.PATH_URL_ANALYZE+type,
        port: 443,
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AI_KEY,
          "Content-Type": "application/json",
          "Content-Length": data.length,
        },
      };
      var body = "";
    var object = [];
      const req = https.request(options, (res) => {
        res.on("data", (d) => {
          process.stdout.write(d);
          body+= d;
        });
        res.on("end", (response) => {
            object.push(body);
            object.join("");
            resolve(object);
        //   const resString = Buffer.concat(body).toString();
          resolve(response);
        });
        req.on("error", (error) => {
          console.error(error);
          reject(error);
        });
      });

      req.on("error", (error) => {
        console.error(error);
      });

      req.write(data);
      req.end();
    });
  },
};
