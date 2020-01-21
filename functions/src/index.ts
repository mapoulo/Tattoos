const functions = require('firebase-functions')
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore()

exports.test = functions.firestore.document('Bookings/{docid}/Requests/{id}').onCreate((snap: { data: () => any; }, context: any) => {
    console.log('Document change', snap.data());
    const dataR = snap.data();

    const token ='eGFvbAkVYDxpRDsTZi1NJe:APA91bHyOBsQnwAQoKECjE0B88u_IOFiO1iMoOuTrUhzDh7dEh6dsu4lybzqCynxcQQUDey0oj9D5suvEOhIjW7Ule_yRuC1vAmv7iYTWudSvRNmPlP0PYs17vdlEmjaaF3PMSNdRgdu'
    const payload = {
        notification: {
            title: 'New Booking!',
            body: `name of customer: ${dataR.customerName} TattooName   ${dataR.tattoName}`,
            icon: 'https://goo.gl/Fz9nrQ'
        }
    }
    return admin.messaging().sendToDevice(token, payload)

})