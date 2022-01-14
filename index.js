const express = require('express');
const path = require('path');

const port = 8000;

const db = require('./config/mongoose');
const Contact = require('./models/contact');

const app = express();

// Templating language - Embedded JavaScript templating (EJS)
// Setting view engine and view path - the view path contains directory and ejs file
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parser
app.use(express.urlencoded());

// Including static pages - contained in folder 'static'
app.use(express.static('static'));

// Middleware
// app.use((req, res, next) => {
//     console.log("Middleware called");
//     next();
// });

// app.use((req, res, next) => {
//     console.log("Middleware 2 called");
//     next();
// });

// var contactList = [
//     {
//         name: "Name1",
//         phone: "1111111111"
//     },
//     {
//         name: "Name2",
//         phone: "2222222222"
//     },
//     {
//         name: "Name3",
//         phone: "3333333333"
//     }
// ];

// Controllers: Request - Response
// Arguments: Route and Controller function
app.get('/', (req, res) => {
    Contact.find({}, (err, contacts) => {
        if (err) {
            console.log('Error in fetching the contacts');
            return;
        }
        res.render('home', {
            paragraph: 'This is a para',
            contact_list: contacts
        });
    })

    
});

app.get('/practice', (req, res) => {
    res.render('practice', {
        para: 'This is a para from practice file'
    })
});

// Create contact
app.post('/create-contact', (req, res) => {
    // Appending the new contact to our contact list
    // contactList.push(req.body);
    Contact.create({ name: req.body.name, phone: req.body.phone }, 
        (err, newContact) => {
            if (err) {
                console.log("Error in creating contact");
                return;
            }
            console.log("********", newContact);
            res.redirect('/');
        }
    );
});

// Delete contact
app.get('/delete-contact', (req, res) => {
    // get the id from query
    let id = req.query.id;

    // find the contact in database entry
    Contact.findByIdAndDelete(id, (err) => {
        if (err) {
            console.log("Error in deleting contact from database");
            return;
        }
        return res.redirect('/');
    });

    // let phone = req.query.phone;
    // let contactIndex = contactList.findIndex(contact => contact.phone == phone);
    // if (contactIndex != -1) {
    //     contactList.splice(contactIndex, 1);
    //     return res.redirect('/');
    // } else {
    //     console.log("Error: cannot find contact index");
    // }
    
});

app.listen(port, (err) => {
    if (err) {
        console.log('Error in running the server: ', err);
        return;
    }
    console.log('Express server is up and running');
});