// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://heroku_4ctwgs4z:ntjklogidorfjep1mkisshtkl2@ds059804.mlab.com:59804/heroku_4ctwgs4z',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'taxbackapp_id_4816_4816_fewegGFBSsddas23cd',
  masterKey: process.env.MASTER_KEY || 'taxbackapp_master_key_dwklnvjbvuyreVFDEGRE543223', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'https://taxbackapp-parse-server.herokuapp.com/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
  
//   emailAdapter: {
//     module: 'parse-server-mailgun',
//     options: {
//       // The address that your emails come from 
//       fromAddress: 'YourApp <ollygreen@hotmail.co.uk>',
//       // Your domain from mailgun.com 
//       domain: 'sandbox45b49914f18c43b38a6a6b82e215b64e.mailgun.org',
//       // Your API key from mailgun.com 
//       apiKey: 'key-d1ac8c43a6001562e96e5eab5906f544',
//       // The template section 
//       templates: {
//         passwordResetEmail: {
//           subject: 'Reset your password',
//           pathPlainText: resolve(__dirname, 'path/to/templates/password_reset_email.txt'),
//           pathHtml: resolve(__dirname, 'path/to/templates/password_reset_email.html'),
//           callback: (user) => { return { firstName: user.get('firstName') }}
//           // Now you can use {{firstName}} in your templates 
//         },
//         verificationEmail: {
//           subject: 'Confirm your account',
//           pathPlainText: resolve(__dirname, 'path/to/templates/verification_email.txt'),
//           pathHtml: resolve(__dirname, 'path/to/templates/verification_email.html'),
//           callback: (user) => { return { firstName: user.get('firstName') }}
//           // Now you can use {{firstName}} in your templates 
//         },
//         customEmailAlert: {
//           subject: 'Urgent notification!',
//           pathPlainText: resolve(__dirname, 'path/to/templates/custom_alert.txt'),
//           pathHtml: resolve(__dirname, 'path/to/templates/custom_alert.html'),
//         }
//       }
//     }
  
   verifyUserEmails: true,
 // Same as the SERVER_URL used to configure ParseServer, in my case it uses Heroku
 publicServerURL: 'https://taxbackapp-parse-server.herokuapp.com//parse', 
 appName: 'taxbackapp',
 emailAdapter: {
    module: 'parse-server-simple-mailgun-adapter',
    options: {
      fromAddress: 'no-reply@example.com',
      domain: 'sandbox45b49914f18c43b38a6a6b82e215b64e.mailgun.org',
      apiKey: 'key-d1ac8c43a6001562e96e5eab5906f544',
    }
 }
  }
  
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
