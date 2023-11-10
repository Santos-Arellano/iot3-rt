const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");
const express = require('express');
const router = express.Router();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iot2023-32f35-default-rtdb.firebaseio.com/"
});

const db = admin.database();

// Ruta para mostrar todos los contactos
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.ref('contacts').once('value');
        const data = snapshot.val();
        res.render('index', { contacts: data });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Ruta para agregar un nuevo contacto
router.post('/new-contact', (req, res) => {
    const { firstname, lastname, email, phone } = req.body;

    const newContact = {
        firstname,
        lastname,
        email,
        phone
    };

    db.ref('contacts').push(newContact);
    res.redirect('/');
});

// Ruta para eliminar un contacto
router.get('/delete-contact/:id', (req, res) => {
    const contactId = req.params.id;

    db.ref(`contacts/${contactId}`).remove()
        .then(() => {
            res.redirect('/');
        })
        .catch((error) => {
            console.error("Error deleting contact:", error);
            res.status(500).send("Internal Server Error");
        });
});

module.exports = router;
