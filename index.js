'use strict'
require('babel-register')
require('dotenv').config()

const fs = require('fs')
const tumblr = require('tumblr.js')
const jsonfile = require('jsonfile')

const client = tumblr.createClient({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET
})

jsonfile.readFile('data.json', (err, obj) => {
  let photos = obj.data
  let globaltags = obj.globalTags

  photos.forEach(photo => {
    fs.readFile(photo.filePath, (err, photoData) => {
      if (err) {
        console.log("ERROR: File " + photo.filePath + " could not be read.")
      } else {
        let photoData64 = new Buffer(photoData).toString('base64');

        client.createPhotoPost(process.env.BLOG_NAME, {
          data64: photoData64,
          tags: photo.hasOwnProperty('tags') ? [...globaltags, ...photo.tags].join(',') : globaltags.join(','),
          caption: photo.hasOwnProperty('caption') ? photo.caption : '' 
        }, (err, res) => {
          if (err) {
            console.log("ERROR:")
            console.log(res)
          } else {
            console.log(photo.filePath + " UPLOAD SUCCESS")
          }
        })
      }
    })
  })
})
