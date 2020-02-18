const functions = require('firebase-functions')
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore()

exports.test = functions.firestore.document('Bookings/{id}').onUpdate((snap: { data: () => any; }) => {
    console.log('Document change is here', snap.data());
    const dataR = snap.data();

   

        const token = dataR.tokenId

        const payload = {
            notification: {
                title: 'New Booking!',
                body: ``
            }
        }

        return admin.messaging().sendToDevice(token, payload)


})

