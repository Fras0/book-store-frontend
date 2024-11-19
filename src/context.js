import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useCallback } from "react";

const URL = `${process.env.REACT_APP_API_URL}/books?`;

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultTitle, setResultTitle] = useState("");

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const searchURL = searchTerm ? `${URL}name=${searchTerm}` : `${URL}`;
      const token = localStorage.getItem("token");

      const response = await axios.get(searchURL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const docs = response.data.data.data;

      if (docs) {
        const newBooks = docs.slice(0, 20).map((bookSingle) => {
          const { _id, name, category, price, seller } = bookSingle;
          return {
            id: _id,
            title: name,
            author: seller,
            price: price,
            category: category.name,
          };
        });

        setBooks(newBooks);
        if (newBooks.length >= 1) {
          setResultTitle("Your Search Result");
        } else {
          setResultTitle("No search Result Found!");
        }
      } else {
        setBooks([]);
        setResultTitle("No search Result Found!");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, fetchBooks]);

  return (
    <AppContext.Provider
      value={{
        loading,
        books,
        setSearchTerm,
        resultTitle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
