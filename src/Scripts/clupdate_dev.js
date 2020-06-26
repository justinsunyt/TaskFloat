const fs = require("fs")
const parse = require("csv-parse")
const admin = require('firebase-admin')
const serviceAccount = require("../../secrets/taskfloat-firebase-adminsdk-9hule-6fffd6efd8.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://taskfloat.firebaseio.com"
})
const classesRef = admin.firestore().collection("classes")

const parser = parse({
    columns: ["name"],
    from: 2
}, (err, data) => {
    if (err) {
        console.log(err)
    } else {
        classesRef.get().then(snap => {
            let existingCl = []
            snap.forEach(doc => {
                existingCl.push(doc.data().name)
            })
            data.forEach(cl => {
                if (!existingCl.includes(cl.name)) {
                    cl.students = []
                    classesRef.add(cl).then(console.log("Added " + cl.name)).catch(err => console.log(err))
                }
            })
        })
    }
})

fs.createReadStream("uploads/classes.csv").pipe(parser)