const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')
const fetch = require('node-fetch')
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'
let config = {}

 function movieCommand(url) {
    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err)
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), function (auth) {
      addMovie(url, auth)
    })
  })
  fs.readFile('config.json', (err, content) => {
    if (err) return console.log('Error loading config file', err)
    config = JSON.parse(content)
  })
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize (credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0])

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback)
    oAuth2Client.setCredentials(JSON.parse(token))
    callback(oAuth2Client)
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken (oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err)
      oAuth2Client.setCredentials(token)
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err)
        console.log('Token stored to', TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

//Not yet implemented
function checkDuplicates (url, auth) {
  const regex = /tt\d+(?=\/)/
  const id = regex.exec(url)[0]
  const sheets = google.sheets({ version: 'v4', auth })
  sheets.spreadsheets.values.get({
    spreadsheetId: '1WMR5_bTdtbPr4BEMBDIbMYIw0OKeSxm266y95CtDwH4',
    range: 'Friday!A2:E'
  }, (err, res) => {
    let noDuplicates = true
    if (err) return console.log('The API returned an error: ' + err)
    const rows = res.data.values
    if (rows) {
      // Print columns A and E, which correspond to indices 0 and 4.
      let found = rows.find((row) => {
        const rowID = regex.exec(row[3])[0]
        return rowID == id
      })
      console.log('I see a thing');
      console.log(found)
      return !found
    } else {
      console.log('No data found.')
      return true
    }
  })
  console.log(url)
}
function addMovie (url, auth) {
  const regex = /tt\d+(?=\/)/
  let id = regex.exec(url)
  if(!id) {
    return;
  }
  id = id[0]
  console.log(id)
  fetch(`http://www.omdbapi.com/?i=${id}&apikey=${config.omdb}`).then(response => response.json()).then(data => {
    console.log(data)
    const sheets = google.sheets({ version: 'v4', auth })

    const values = [
      [
        data.Title,
        data.Year,
        data.Runtime,
        url
      ]
      // Additional rows ...
    ]
    const resource = {
      values
    }
    sheets.spreadsheets.values.append({
      spreadsheetId: '1WMR5_bTdtbPr4BEMBDIbMYIw0OKeSxm266y95CtDwH4',
      range: 'Friday',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource
    }, (err, result) => {
      if (err) {
        // Handle error.
        console.log(err)
      } else {
        console.log(`${result.data.updates.updatedRange} cells appended.`)
      }
    })
  })
}
module.exports = { movieCommand }