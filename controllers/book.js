const Book = require("../models/book");

exports.addBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);

    const { _id, __v, ...bookInfo } = newBook.toObject();

    res.status(201).json(bookInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateBook = async (req, res) => {
  const bookId = req.params.id;

  try {
    const updatedBook = await Book.findOneAndUpdate({ id: bookId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return res
        .status(404)
        .json({ message: `book with id: ${bookId} was not found` });
    }

    const { _id, __v, ...updatedBookInfo } = updatedBook.toObject();
    res.status(201).json(updatedBookInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBookById = async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await Book.findOne({ id: bookId });

    if (!book) {
      return res
        .status(404)
        .json({ message: `book with id: ${bookId} was not found` });
    }

    const { _id, __v, ...bookInfo } = book.toObject();
    res.status(201).json(bookInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { title, author, genre } = req.query;
    const { sort = "id", order = "ASC" } = req.query;

    const query = {};
    if (title) query.title = title;
    if (author) query.author = author;
    if (genre) query.genre = genre;

    const sortOrder = order === "DESC" ? -1 : 1;
    let sortBy = sort;
    if (!["title", "author", "genre", "price"].includes(sort)) {
      sortBy = "id";
    }

    const books = await Book.find(query)
      .select("-_id -__v")
      .sort({ [sortBy]: sortOrder });

    res.status(200).json({ books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
