const express = require('express');
const soap = require('soap');
const {readFileSync} = require("fs");
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.raw({ type: () => true }));
// Définissez le service SOAP
const service = {
    MyService: {
        MyPort: {
            MyFunction: function (args) {
                console.log(args);
                let time = args.time;
                let timeH = Math.floor(time/3600);
                let timeM = Math.floor((time % 3600) / 60);
                return {
                    data: timeH + "h" + timeM
                };
            }
        }
    }
};

// Créez le serveur SOAP
const wsdlPath = "/wsdl";
const wsdlContent = readFileSync('./my-service.wsdl', 'utf8');

app.listen(PORT, () => {
    soap.listen(app, wsdlPath, service, wsdlContent, function () {
        console.log(`SOAP server is listening on ${wsdlPath} and PORT = ${PORT}`);
    });
})


