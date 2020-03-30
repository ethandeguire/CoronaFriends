const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()



exports.getPosts = functions.https.onCall((data, context) => {

    // client request options
    let clientSelectedType = data.type
    let numInPage = Number(data.numInPage)
    let pageNum = Number(data.pageNum)

    console.log(numInPage, pageNum)

    const db = admin.firestore()
    const postingsRef = db.collection('postings')
    const postingsOfCorrectType = postingsRef.where('type', '==', clientSelectedType);
    const getPostingsByTime = postingsOfCorrectType.orderBy("timestamp", 'desc').limit(numInPage).offset((pageNum - 1) * numInPage)
    return getPostingsByTime.get()
        .then(docs => {

            // this is the array that we send back to the client to be displayed
            let displayDocs = []

            docs.forEach(doc => {
                console.log(doc)
                displayDocs.push(doc._fieldsProto)
            })

            return displayDocs
        })
        .catch(err => console.log(err))
})
