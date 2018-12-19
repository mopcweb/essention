const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
})

// Api get
app.get('/api/get', (req ,res) => {
  const data = req.headers.data
  res.sendFile(path.join(__dirname, 'data', `data.txt`))
});

// Api post
app.post('/api/post', function(req, res) {

  let body = '';
  if (body != '') body = ''

  let filePath = path.join(__dirname, 'data', `data.txt`);
  req.on('data', function(data) {
    body += data;
  });

  req.on('end', function (){
    fs.writeFile(filePath, body, function() {
      res.send(console.log('Yeah'));
    });
  });
});

// Serve static files from build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/public')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
  });
};

app.listen(port, (err) => {
  if (err) console.log(err);

  console.log(`Server is ready on port ${port}`)
})
