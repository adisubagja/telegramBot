var http = require('http');
const URL = "http://static.pipezero.com/covid/data.json";
module.exports = {
    covid: () => {
        return new Promise((resovle, reject) => {
            http.get(URL, function (res) {
                var body = "";
                res.on('data', function (chunk) {
                    body += chunk;
                });
                res.on('end', function () {
                    if (res.statusCode === 200) {
                        data = JSON.parse(body);
                        var hanoi;
                        if (data != null) {
                            var total = data['total']['internal'];
                            var thanhpho = data['locations'];
                            // object.push(data);
                            // object.join("");
                            // resolve(object);
                            for (var item of thanhpho) {
                                if (item.name === "Hà Nội") {
                                    hanoi = {
                                        name: item.name,
                                        death: item.death,
                                        cases: item.cases,
                                        casesToday: item.casesToday
                                    }
                                }
                            }
                            var result = {
                                canuoc: total,
                                hanoi: hanoi
                            }
                           resovle(result);
                        }

                    }
                    // đã lấy được json
                });
            }).on('error', function (e) {
                console.log(e);
            });
        });
    }
}
