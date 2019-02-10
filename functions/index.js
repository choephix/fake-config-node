const functions = require( 'firebase-functions' )
const admin = require( 'firebase-admin' )
const express = require( 'express' )
const pug = require('pug')

const fapp = admin.initializeApp( functions.config().firebase )
const db = fapp.firestore()
const app = express()

app.get( '/edit/:doc', ( req, res ) => {
  let doc_name = req.params['doc']
  let ref = db.collection( 'configs' ).doc( doc_name )
  ref.get().then( doc => {
    let json = !doc.exists ? "{}" : doc.data().json
    let data = { json: json, doc : doc_name }
    let html = pug.renderFile( 'edit.pug', data )
    return res.send( html ) 
  } ).catch( e => res.send( e ) )
} )

app.post( '/set/:doc', ( req, res ) => {
  let doc_name = req.params['doc']
  let ref = db.collection( 'configs' ).doc( doc_name )
  let json = req.body
  ref.set( { json: json } )
     .then( o => res.send( 'ok' ) )
     .catch( e => res.send( e ) )
} )

app.get( '/view/:doc', ( req, res ) => {
  console.clear()
  let doc_name = req.params['doc']
  let ref = db.collection( 'configs' ).doc( doc_name )
  res.setHeader( 'Content-Type', 'application/json' );
  ref.get()
     .then( doc => res.send( !doc.exists ? "{}" : doc.data().json ) )
     .catch( e => res.send( e ) )
} )

exports.app = functions.https.onRequest( app )
