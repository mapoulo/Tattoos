

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions')
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore()

exports.test = functions.firestore.document('Bookings/{docid}').onCreate((snap: { data: () => any; }, context: any) => {
    console.log('Document change', snap.data().tokenId);
    const dataR = snap.data();

   

        const token = snap.data().tokenId

        const payload = {
            notification: {
                title: 'New Booking!',
                body: `name of customer: ${dataR.customerName} TattooName   ${dataR.tattoName}`
               
            },
            token
        }

        return admin.messaging().send(payload)

})




