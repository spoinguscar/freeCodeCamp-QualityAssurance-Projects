'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      const books = await Book.find({}, '_id title comments');
      res.json(books.map(book => ({
        comments: book.comments,
        _id: book._id,
        title: book.title,
        commentcount: book.comments.length
      })));
    })
    .post(async function (req, res) {
      let title = req.body.title;
      if (!title) {
        return res.send('missing required field title');
      }
      const newBook = new Book({ title });
      await newBook.save();
      res.json({ _id: newBook._id, title: newBook.title });
    })
    .delete(async function (req, res) {
      await Book.deleteMany({});
      res.send('complete delete successful');
    });

  app.route('/api/books/:id')
    .get(async function (req, res) {
      try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.send('no book exists');
        res.json(book);
      } catch (err) {
        res.send('no book exists');
      }
    })
    .post(async function (req, res) {
      try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.send('no book exists');
        if (!req.body.comment) return res.send('missing required field comment');
        book.comments.push(req.body.comment);
        await book.save();
        res.json(book);
      } catch (err) {
        res.send('no book exists');
      }
    })
    .delete(async function (req, res) {
      try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.send('no book exists');
        res.send('delete successful');
      } catch (err) {
        res.send('no book exists');
      }
    });
};
