const express         = require('express'),
      bodyParser      = require('body-parser'),
      request         = require('request'),
      PORT            = 3000;
require('dotenv').config();

const app = express();
const api_key = process.env.API_KEY;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function(req, res){
  res.sendFile(__dirname +  '/signup.html');
});

app.post('/', function(req, res){
  let firstName = req.body.fName;
  let lastName = req.body.lName;
  let email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  
  const jsonData = JSON.stringify(data);
  
  const options = {
    url: 'https://us4.api.mailchimp.com/3.0/lists/c20084a671',
    method: 'POST',
    headers: {
      'Authorization': `kholub1989 ${api_key}`
    },
    body: jsonData,
  };
  request(options, function(error, response, body){
    if(error) {
      res.sendFile(__dirname + '/failure.html');
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + '/success.html');
      } else {
        res.sendFile(__dirname + '/failure.html');
      }
    }
  });
});

app.post('/failure', function(req, res){
  res.redirect('/');
})



app.listen(process.env.PORT || PORT, () => console.log(`Server is running on port ${PORT}`));
