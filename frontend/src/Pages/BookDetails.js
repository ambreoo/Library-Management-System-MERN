import { useEffect, useState } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import "./BookDetails.css";

function BookDetails() {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();

  const [book, setBook] = useState(null);

  // Read passed data
  const filteredBooks = location.state?.filteredBooks || [];
  const currentIndex = location.state?.index ?? -1;

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}api/books/getbook/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error("Error fetching book:", err);
      }
    };

    fetchBook();
  }, [id]);

  if (!book) return <div className="book-details">Loading...</div>;

  const goToBook = (index) => {
    const newBook = filteredBooks[index];
    if (!newBook) return;

    history.push({
      pathname: `/book/${newBook._id}`,
      state: {
        filteredBooks,
        index
      }
    });
  };

  return (
    <div className="book-details">
        <div className="back-button-container">
        <button className="back-button" onClick={() => { history.push("/books");}}>← Back to All Books</button>
        </div>
        <div className="book-info">
        <div className="book-cover">
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt={book.bookName} />
          ) : (
            <div className="no-image">No cover image</div>
          )}
        </div>

        <div className="book-meta">
          <h1>{book.bookName}</h1>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Publisher:</strong> {book.publisher}</p>
          <p><strong>ISBN:</strong> {book.isbn}</p>
          <p><strong>Congress Code:</strong> {book.congressCode}</p>
          <p><strong>Available Copies:</strong> {book.bookCountAvailable}</p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="book-nav-buttons">
        <button
          onClick={() => goToBook(currentIndex - 1)}
          disabled={currentIndex <= 0}
        >
          &lt; Previous
        </button>
        <button
          onClick={() => goToBook(currentIndex + 1)}
          disabled={currentIndex >= filteredBooks.length - 1}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}

export default BookDetails;
