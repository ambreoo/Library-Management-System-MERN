import { useEffect, useState, useContext } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import "./BookDetails.css";

function BookDetails() {
    const API_URL = process.env.REACT_APP_API_URL
    const { id } = useParams();
    const history = useHistory();
    const location = useLocation();
    const { user } = useContext(AuthContext);

    const filteredBooks = location.state?.filteredBooks || [];
    const currentIndex = location.state?.index ?? -1;
    const [book, setBook] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedBook, setEditedBook] = useState({});

    useEffect(() => {
        const fetchBook = async () => {
        try {
            const res = await axios.get(`${API_URL}api/books/getbook/${id}`);
            setBook(res.data);
        } catch (err) {
            console.error("Error fetching book:", err);
        }
        };
        fetchBook();
    }, [id]);

    useEffect(() => {
        if (book) {
        setEditedBook({
            bookName: book.bookName || "",
            author: book.author || "",
            publisher: book.publisher || "",
            isbn: book.isbn || "",
            congressCode: book.congressCode || "",
            bookCountAvailable: Number(book.bookCountAvailable) || 0,
        });
        }
    }, [book]);

    const handleSave = async () => {
        try {
            await axios.put(`${API_URL}api/books/updatebook/${book._id}`, { ...editedBook, isAdmin: user?.isAdmin },);
            setBook({ ...book, ...editedBook });
            setEditMode(false);
            alert("Book updated successfully 🎉");
        } catch (err) {
            console.error("Failed to save book:", err);
        }
    };

    const goToBook = (index) => {
        const newBook = filteredBooks[index];
        if (!newBook) return;
        history.push({
        pathname: `/book/${newBook._id}`,
        state: { filteredBooks, index }
        });
    };

    if (!book) return <div className="book-details">Loading...</div>;

    return (
    <div className="book-details">
        <div className="back-button-container">
            {user?.isAdmin && !editMode && (
                <button
                className="edit-button"
                onClick={() => setEditMode(true)}
                title="Edit Book Info"
                >✏️ Edit</button>
            )}
            {!editMode && (
            <button
                className="back-button"
                onClick={() => {
                const { page } = location.state || {};
                if (page != null) sessionStorage.setItem("booksGridState", JSON.stringify({ page }));
                history.push("/books");
                }}
            >
                ← Back to All Books
            </button>
            )}
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
          {editMode ? (
            <>
              <h1><input className="edit-overlay-input" value={editedBook.bookName} onChange={(e) => setEditedBook({ ...editedBook, bookName: e.target.value })} /></h1>
              <p><strong>Author:</strong> <input className="edit-overlay-input" value={editedBook.author} onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })} /></p>
              <p><strong>Publisher:</strong> <input className="edit-overlay-input" value={editedBook.publisher} onChange={(e) => setEditedBook({ ...editedBook, publisher: e.target.value })} /></p>
              <p><strong>ISBN:</strong> <input className="edit-overlay-input" value={editedBook.isbn} onChange={(e) => setEditedBook({ ...editedBook, isbn: e.target.value })} /></p>
              <p><strong>Congress Code:</strong> <input className="edit-overlay-input" value={editedBook.congressCode} onChange={(e) => setEditedBook({ ...editedBook, congressCode: e.target.value })} /></p>
              <p><strong>Available Copies:</strong>
                <span className="editable-field">
                  <div className="counter-controls inline">
                    <button onClick={() => setEditedBook((prev) => ({ ...prev, bookCountAvailable: Math.max(0, prev.bookCountAvailable - 1) }))}>▼</button>
                    <span>{editedBook.bookCountAvailable}</span>
                    <button onClick={() => setEditedBook((prev) => ({ ...prev, bookCountAvailable: prev.bookCountAvailable + 1 }))}>▲</button>
                  </div>
                </span>
              </p>
            </>
          ) : (
            <>
              <h1>{book.bookName}</h1>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Publisher:</strong> {book.publisher}</p>
              <p><strong>ISBN:</strong> {book.isbn}</p>
              <p><strong>Congress Code:</strong> {book.congressCode}</p>
              <p><strong>Available Copies:</strong> {book.bookCountAvailable}</p>
            </>
          )}
        </div>
      </div>

      <div className="book-nav-buttons">
        {editMode ? (
          <>
            <button className="save-button" onClick={handleSave}>💾 Save</button>
            <button className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button className="save-button" onClick={() => goToBook(currentIndex - 1)} disabled={currentIndex <= 0}>&lt; Previous</button>
            <button className="save-button" onClick={() => goToBook(currentIndex + 1)} disabled={currentIndex >= filteredBooks.length - 1}>Next &gt;</button>
          </>
        )}
      </div>
    </div>
  );
}

export default BookDetails;
