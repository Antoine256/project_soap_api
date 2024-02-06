const express = require('express');
const soap = require('soap');
const {readFileSync} = require("fs");
const cors = require('cors');


const app = express();

app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.raw({ type: () => true }));
// Définissez le service SOAP
const service = {
    MyService: {
        MyPort: {
            MyFunction: function (args) {
                console.log("Je fais la fonction avec les arguments suivants : "+args.name);
                return {
                    result: ("Hello, " + args.name)
                };
            }
        }
    }
};

// Créez le serveur SOAP
const wsdlPath = "/my-road?wsdl";
const wsdlContent = readFileSync('./my-service.wsdl', 'utf8');
soap.listen(app, wsdlPath, service, wsdlContent, function () {
    console.log(`SOAP server is listening at http://localhost:3000${wsdlPath}`);
});

// Définissez un endpoint pour les requêtes SOAP
app.get('/my-road', (req, res) => {
    console.log("SOAP request body: "+req.body);
    let result = service.MyService.MyPort.MyFunction(parseSoapRequest(req.body));
    res.send("SOAP request endpoint"+result.result);
});

app.get('/', (req, res) => {
    result = "Hello World!";
    res.send('Hello World!');
});

// Fonction pour extraire les paramètres de la requête SOAP
function parseSoapRequest(soapRequest) {
    const parseString = require('xml2js').parseString;

    let args = {};

    parseString(soapRequest, { explicitArray: false }, (err, result) => {
        if (err) {
            console.error("Error parsing SOAP request: "+ err);
        } else {
            // Customisez cela en fonction de la structure réelle de votre requête SOAP
            const nameElement = result['soapenv:Envelope']['soapenv:Body']['web:MyFunction']['web:name'];

            // Supprimez les guillemets simples autour de la valeur 'Route de la soie'
            args.name = nameElement.replace(/^'|'$/g, '');
        }
    });

    return args;
}

// Démarrez le serveur HTTP
const port = 3000;
app.listen(port, () => {
    console.log("Server is listening on port "+port);
});
