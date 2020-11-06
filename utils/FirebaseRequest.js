import * as firebase from 'firebase';
import 'firebase/firestore';

import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

class FirebaseRequest {
  // Lifecycle ============================================================================================
  constructor(){
    const firebaseConfig = {
      apiKey: "AIzaSyAZPAk3Bfw31zVgrRpxoEgZgbByNQzErYw",
      authDomain: "junction2020-dd19e.firebaseapp.com",
      databaseURL: "https://junction2020-dd19e.firebaseio.com",
      projectId: "junction2020-dd19e",
      storageBucket: "junction2020-dd19e.appspot.com",
      messagingSenderId: "412215452608",
      appId: "1:412215452608:web:dccd5a16ba96de6ac2de25"
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    } else {
      firebase.app()
    }

    // MEMO: - Anonymously Login
    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        console.log('is login')
      } else {
        console.log('is not login')
        firebase.auth().signInAnonymously()
      }
    })
  }

  // MEMO: - Example
  getSpecificNoteByKey = async(key) => {
    var refQuery = this.noteCollection.where('key', '==', key)
    var note = null
    var error = null
    await refQuery.get()
    .then(query => {
      query.forEach(doc => {
        note = doc.data()
      })
    })
    .catch((error) => {
      console.log('Error getting documents', error)
      error = error
    })
    return { note, error }
  }

  // MEMO: - Firestore Path
  get noteCollection() {
    return firebase.firestore().collection("notes")
  }
}

FirebaseRequest.shared = new FirebaseRequest()
export default FirebaseRequest