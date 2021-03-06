const db = require('./init');
const knex = db.knex;
const bookshelf = db.bookshelf;
// const bodyParser = require('body-parser');

// Contacts table schema
knex.schema.createTableIfNotExists('contacts', (table) => {
  table.increments('id').primary();
  table.string('name');
  table.string('email');
  table.string('phone');
  table.string('facebook');
  table.string('twitter');
  table.string('lastContacted');
  table.string('contactFrequency');
  table.string('contactNext');
  table.string('notes');
  table.timestamps();
}).then(() => (undefined)); // We need to call .then to create the table, but don't need
// to actually do anything in the callback.

// Contacts model
const ContactModel = bookshelf.Model.extend({
  tableName: 'contacts',
  hasTimestamps: true,
});

// Contacts API
const ContactsAPI = {
  fetch() {
    return ContactModel.fetchAll()
      .then((contacts) => contacts.toJSON());
  },
  delete(userId) {
    return (new ContactModel({ id: userId })).destroy();
  },
  add(newContact) {
    return (new ContactModel(newContact)).save();
  },
};

// <editor-fold desc="Add dummy data to db">
// const dummyContactData = [
//  {
//    name: 'Elyse Greenarry',
//    // id: 1,
//    lastContacted: new moment("2016-07-01").hours(0).minutes(0).seconds(0).milliseconds(0),
//    contactFrequency: 1,
//    contactNext: new moment("2016-07-02"),
//    notes: 'Talk to her about my cool MVP.\n\nMarried on 5/14/16.\nBirthday 6/14/88',
//  },
//  {
//    name: 'Chris Brenton',
//    // id: 2,
//    lastContacted: new moment("2016-06-30"),
//    contactFrequency: 14,
//    contactNext: new moment("2016-07-13"),
//    notes: "Python coder. Started the High Impact dodgeball league. Works a lot on improving/automating people's " +
//    "workflows, e.g. deployment workflows.",
//  },
//  {
//    name: 'Catrina Fuentes',
//    // id: 3,
//    lastContacted: new moment("2015-02-20"),
//    contactFrequency: 180,
//    contactNext: new moment("2016-10-20"),
//    notes: 'Recently (1/2015) started working at a cool company doing social media work for nonprofits.' +
//    '\n\nInterned for me at Davis Dollars',
//  },
//  {
//    name: 'Nick Winter',
//    // id: 4,
//    lastContacted: new moment("2015-01-30"),
//    contactFrequency: 365,
//    contactNext: new moment("2016-01-30"),
//    notes: "Met through Cassie Winter, Nick's cousin. Nick started Code Combat, and now it mostly runs itself.",
//  },
//  {
//    name: 'Reed Cureton',
//    // id: 5,
//    lastContacted: new moment("2016-10-10").hours(0).minutes(0).seconds(0).milliseconds(0),
//    contactFrequency: 3,
//    contactNext: (new moment("2016-10-10")).add(3, 'days'),
//    notes: 'Get him to tell more funny jokes. Thank him for being a kick-ass fellow.',
//  },
// ];
//
// dummyContactData.forEach(c => {
//  const contact = new ContactModel();
//  contact.set('name', c.name);
//  contact.set('contactFrequency', c.contactFrequency);
//  contact.set('contactNext', c.contactNext.format());
//  contact.set('lastContacted', c.lastContacted.format());
//  contact.set('notes', c.notes);
//
//  contact.save()
//    .then(u => console.log('User saved: ', `${u.get('id')} ${u.get('name')}`))
//    .catch(e => console.log(e));
// });
// </editor-fold>

module.exports = ContactsAPI;
