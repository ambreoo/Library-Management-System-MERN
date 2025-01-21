import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { AuthContext } from '../../../../Context/AuthContext'
import { Dropdown } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next';

function AddBook() {

    const API_URL = process.env.REACT_APP_API_URL
    // const API_URL = "http://localhost:3001/"
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useContext(AuthContext)
    const { t } = useTranslation();
    const [bookName, setBookName] = useState("")
    const [congressCode, setCongressCode] = useState("")
    const [originalCode, setOriginalCode] = useState("")
    const [author, setAuthor] = useState("")
    const [bookCountAvailable, setBookCountAvailable] = useState(null)
    const [isbn, setIsbn] = useState("")
    const [publisher, setPublisher] = useState("")
    const [allCategories, setAllCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [recentAddedBooks, setRecentAddedBooks] = useState([])
    const [allBooks, setAllBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);


    /* Fetch all the Categories */
    useEffect(() => {
        const getAllCategories = async () => {
            try {
                const response = await axios.get(API_URL + "api/categories/allcategories")
                const all_categories = await response.data.map(category => (
                    { value: `${category._id}`, text: `${category.categoryName}` }
                ))
                setAllCategories(all_categories)
            }
            catch (err) {
                console.log(err)
            }
        }
        getAllCategories()
    }, [API_URL])

    useEffect(() => {
        const getallBooks = async () => {
          const response = await axios.get(API_URL + "api/books/allbooks");
          setRecentAddedBooks(response.data.slice(0, 5));
          setAllBooks(response.data.map((book) => ({
            value: book._id,
            text: book.bookName,
            data: book,
          })));
        };
        getallBooks();
    }, [API_URL]);

    /* Adding book function */
    const addBook = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const BookData = {
            congressCode: congressCode,
            originalCode: originalCode,
            publisher: publisher,
            isbn: isbn,
            categories: selectedCategories,
            bookName: bookName,
            author: author,
            bookCountAvailable: bookCountAvailable,
            isAdmin: user.isAdmin
        }
        try {
            if (selectedBook) {
                await axios.put(`${API_URL}api/books/updatebook/${selectedBook._id}`, BookData);
                const updatedBook = await axios.get(`${API_URL}api/books/getbook/${selectedBook._id}`);
                const updatedBookDetails = {
                    value: updatedBook.data._id,
                    text: updatedBook.data.bookName,
                    data: updatedBook.data,
                };
                setAllBooks((prevBooks) =>
                    prevBooks.map((book) =>
                        book.value === updatedBookDetails.value ? updatedBookDetails : book
                    )
                );
                alert("Book updated successfully 🎉");
            } else {
                // Add new book
                const response = await axios.post(`${API_URL}api/books/addbook`, BookData);
                
                // Fetch the newly added book from the backend
                const newBook = await axios.get(`${API_URL}api/books/getbook/${response.data._id}`);
                const newBookDetails = {
                    value: newBook.data._id,
                    text: newBook.data.bookName,
                    data: newBook.data,
                };

                // Add the new book to allBooks state
                setAllBooks((prevBooks) => [...prevBooks, newBookDetails]);

                if (recentAddedBooks.length >= 5) {
                    recentAddedBooks.splice(-1);
                }
                setRecentAddedBooks([newBook.data, ...recentAddedBooks]);
                alert("Book added successfully 🎉");
                resetForm();
            }
        }
        catch (err) {
            console.log(err)
        }
        setIsLoading(false)
    }

    const resetForm = () => {
        setBookName("");
        setCongressCode("");
        setOriginalCode("");
        setAuthor("");
        setBookCountAvailable("");
        setIsbn("");
        setPublisher("");
        setSelectedCategories([]);
        setSelectedBook(null);
    };

    const handleBookSelection = (event, data) => {
        const selectedValue = data.value;
        if (!selectedValue) {
            // Reset form when "Add New Book" is selected
            resetForm();
            return;
        }
        const selected = allBooks.find((book) => book.value === data.value);
        if (selected) {
          const { data: bookDetails } = selected;
    
          // Populate fields with selected book's data
          setSelectedBook(bookDetails);
          setBookName(bookDetails.bookName || "");
          setCongressCode(bookDetails.congressCode || "");
          setOriginalCode(bookDetails.originalCode || "");
          setAuthor(bookDetails.author || "");
          setBookCountAvailable(bookDetails.bookCountAvailable ?? "");
          setIsbn(bookDetails.isbn || "");
          setPublisher(bookDetails.publisher || "");
          setSelectedCategories(bookDetails.categories || []);
        }
    };

    return (
        <div>
            <p className="dashboard-option-title">{t('addEditBook.addEditBook')}</p>
            <div className="dashboard-title-line"></div>
            <form className='addbook-form' onSubmit={addBook}>
                <div className="semanticdropdown">
                    <Dropdown
                        placeholder={t('addEditBook.selectBook')}
                        fluid
                        search
                        selection
                        options={[{ value: "", text: t('addEditBook.selectBook') }, ...allBooks]}
                        onChange={handleBookSelection}
                    />
                </div>
                <label className="addbook-form-label" htmlFor="bookName">{t('addEditBook.bookName')}<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="text" name="bookName" value={bookName} onChange={(e) => { setBookName(e.target.value) }} required></input><br />

                <label className="addbook-form-label" htmlFor="congressCode">Congress Code</label><br />
                <input className="addbook-form-input" type="text" name="congressCode" value={congressCode} onChange={(e) => { setCongressCode(e.target.value) }}></input><br />

                <label className="addbook-form-label" htmlFor="originalCode">{t('addEditBook.originalCode')}</label><br />
                <input className="addbook-form-input" type="text" name="originalCode" value={originalCode} onChange={(e) => { setOriginalCode(e.target.value) }}></input><br />

                <label className="addbook-form-label" htmlFor="author">{t('addEditBook.authorName')}<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="text" name="author" value={author} onChange={(e) => { setAuthor(e.target.value) }} required></input><br />

                <label className="addbook-form-label" htmlFor="isbn">ISBN</label><br />
                <input className="addbook-form-input" type="text" name="isbn" value={isbn} onChange={(e) => { setIsbn(e.target.value) }}></input><br />

                <label className="addbook-form-label" htmlFor="publisher">{t('addEditBook.publisher')}</label><br />
                <input className="addbook-form-input" type="text" name="publisher" value={publisher} onChange={(e) => { setPublisher(e.target.value) }}></input><br />

                <label className="addbook-form-label" htmlFor="copies">{t('addEditBook.copies')}<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="text" name="copies" value={bookCountAvailable} onChange={(e) => { setBookCountAvailable(e.target.value) }} required></input><br />

                <label className="addbook-form-label" htmlFor="categories">{t('addEditBook.categories')}<span className="required-field"></span></label><br />
                <div className="semanticdropdown">
                    <Dropdown
                        placeholder={t('addEditBook.categories')}
                        fluid
                        multiple
                        search
                        selection
                        options={allCategories}
                        value={selectedCategories}
                        onChange={(event, value) => setSelectedCategories(value.value)}
                    />
                </div>

                <input className="addbook-submit" type="submit" value={t('addEditBook.submit')} disabled={isLoading}></input>
            </form>
            <div>
                <p className="dashboard-option-title">{t('addEditBook.recentlyAdded')}</p>
                <div className="dashboard-title-line"></div>
                <table className='admindashboard-table'>
                    <tr>
                        <th>S.No</th>
                        <th>{t('addEditBook.bookName')}</th>
                        <th>{t('addEditBook.date')}</th>
                    </tr>
                    {
                        recentAddedBooks.map((book, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{book.bookName}</td>
                                    <td>{book.createdAt.substring(0, 10)}</td>
                                </tr>
                            )
                        })
                    }
                </table>
            </div>
        </div>
    )
}

export default AddBook