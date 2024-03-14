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

// Définissez un endpoint pour les requêtes SOAP
// app.get('/my-road', (req, res) => {
//     console.log(req);
//     let result = service.MyService.MyPort.MyFunction(parseSoapRequest(req.body));
//     res.send(result);
// });
//
// app.get('/', (req, res) => {
//     result = "Hello World!";
//     res.send('Hello World!');
// });

// Fonction pour extraire les paramètres de la requête SOAP
// function parseSoapRequest(soapRequest) {
//     const parseString = require('xml2js').parseString;
//
//     let args = {};
//
//     parseString(soapRequest, { explicitArray: false }, (err, result) => {
//         if (err) {
//             console.error("Error parsing SOAP request: "+ err);
//         } else {
//             // Customisez cela en fonction de la structure réelle de votre requête SOAP
//             const nameElement = result['soapenv:Envelope']['soapenv:Body']['web:MyFunction']['web:name'];
//
//             // Supprimez les guillemets simples autour de la valeur 'Route de la soie'
//             args.name = nameElement.replace(/^'|'$/g, '');
//         }
//     });
//
//     return args;
// }

// app.listen(PORT, () => {
//     console.log("Server is listening on port "+PORT);
// });
