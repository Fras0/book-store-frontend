import React from "react";
import { useGlobalContext } from "../../context";
import Loading from "./../Loader/Loader";
import coverImg from "./../../images/book_default_image.jpg";
import "./BookList.css";
import Book from "./Book";

const BookList = () => {
  const { books, loading, resultTitle } = useGlobalContext();
  const bookWithCovers = books.map((singleBook) => {
    return {
      ...singleBook,
      cover_img: singleBook.cover_id
        ? `put here the path of the cover`
        : coverImg,
    };
  });

  if (loading) return <Loading />;

  return (
    <section className="booklist">
      <div className="container">
        <div className="section-title">
          <h2>{resultTitle}</h2>
        </div>
        <div className="booklist-content grid">
          {bookWithCovers.slice(0, 30).map((item, index) => {
            return <Book key={index} {...item} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default BookList;
