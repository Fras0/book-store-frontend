import React from "react";
import { Link } from "react-router-dom";
import "./BookList.css";

const Book = (book) => {
  return (
    <div className="book-item flex flex-column flex-sb">
      <div className="book-item-img">
        <img src={book.cover_img} alt="cover"></img>
      </div>
      <div className="book-item-info text-center">
        <Link to={`/books/${book.id}`} {...book}>
          <div className="book-item-info-item title fw-7 fs-18">
            <span>{book.title}</span>
          </div>
        </Link>

        <div className="book-item-info-item author fs-15">
          <span className="text-capitalize fw-7">Author: </span>
          <span>{book.author.name}</span>
        </div>
        <div className="book-item-info-item author fs-15">
          <span className="text-capitalize fw-7">Category: </span>
          <span>{book.category}</span>
        </div>

      </div>
    </div>
  );
};

export default Book;
