const express = require('express');
const open = require('open');
const cp = require('child_process');
const { Console } = require('console');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

 var db = new sqlite3.Database('C:/Users/Utkarsh/OneDrive/Desktop/History');
 console.log(db);

app.get('/start/:browser/:url', async (req, res) => {
    const browser = req.params.browser;
    const url = req.params.url;
    await open(url, { app: { name: browser } });
    res.send(req.params.browser);
    getCurrentUrl(req)
});

app.get('/stop/:browser', async (req, res) => {
    const browser = req.params.browser;
    if (browser === 'firefox') cp.exec('taskkill /f /im firefox.exe');
    else cp.exec('taskkill /f /im chrome.exe');
    res.send(req.params.browser);
});

function getCurrentUrl(req){
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    console.log("Current tab url",fullUrl)
}

app.get('/history', async (req, res) => {
     db.serialize(function () {
        db.all('SELECT * FROM urls ORDER BY id DESC LIMIT 10;', function (err, rows) {
             console.log(rows);
         });
     });

});

app.get('/delete/:browser', async (req, res) => {
    const browser = req.params.browser;
    function onDeleteAll() {
        console.log("Deleted all history");
      }
      
      function deleteAllHistory() {
        let deletingAll = browser.history.deleteAll();
        deletingAll.then(onDeleteAll);
      }
     deleteAllHistory()
});

app.get('/geturl/:browser', async (req, res) => {
     const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
     console.log("Current tab url",fullUrl)
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
