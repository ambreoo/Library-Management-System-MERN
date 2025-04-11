import { useEffect, useState, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom"; 
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./Allbooks.css";


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Allbooks() {
  const API_URL = process.env.REACT_APP_API_URL;
  const history = useHistory();
  const queryParams = useQuery();
  const gridRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState(queryParams.get("category") || "bookName");
  const [searchQueryResult, setSearchQueryResult] = useState(queryParams.get("query") || "");
  const [books, setBooks] = useState([]);  
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState({});
  const [gridReady, setGridReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const updateURL = (query, category) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (query) params.set("query", query);
    history.replace({ search: params.toString() });
  };

  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setSearchQueryResult(newQuery);
    updateURL(newQuery, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    updateURL(searchQueryResult, newCategory);
  };

  useEffect(() => {
    setSelectedCategory(queryParams.get("category") || "bookName");
    setSearchQueryResult(queryParams.get("query") || "");
  }, [queryParams]);

  useEffect(() => {
    if (!gridReady || isLoading || !gridRef.current?.api) return;
    const savedState = JSON.parse(sessionStorage.getItem("booksGridState"));
  
    if (savedState?.page != null) {
      gridRef.current.api.paginationGoToPage(savedState.page);
      sessionStorage.removeItem("booksGridState");
    }
  }, [gridReady, isLoading, filteredBooks]);

  useEffect(() => {
    const getAllBooks = async () => {
      if (!gridReady || !gridRef.current?.api) return;

      gridRef.current.api.showLoadingOverlay();
      setIsLoading(true);

      try {
        const response = await axios.get(`${API_URL}api/books/allbooks`);
        
        setTimeout(() => {
          setBooks(response.data);
          setFilteredBooks(response.data);
          setIsLoading(false);

          if (gridRef.current?.api) {
            gridRef.current.api.hideOverlay();
          }
        }, 300);
      } catch (error) {
        console.error("Error fetching books:", error);
        setIsLoading(false);
      }
    };

    const getAllCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}api/categories/allcategories`);
        const categoryMap = response.data.reduce((map, cat) => {
          map[cat._id.toString()] = cat.categoryName;
          return map;
        }, {});
        setCategories(categoryMap);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getAllBooks();
    getAllCategories();
  }, [API_URL, gridReady]);

  useEffect(() => {
    if (isLoading) return;

    const queryLower = searchQueryResult.toLowerCase();

    const results = books.filter((book) => {
      if (!searchQueryResult) return true;

      if (selectedCategory === "bookName") {
        return book.bookName?.toLowerCase().includes(queryLower);
      } else if (selectedCategory === "author") {
        return book.author?.toLowerCase().includes(queryLower);
      } else if (selectedCategory === "categories") {
        return Array.isArray(book.categories) 
          ? book.categories.some((id) => categories[id]?.toLowerCase().includes(queryLower)) 
          : false;
      }
      return false;
    });

    setFilteredBooks(results);
  }, [searchQueryResult, selectedCategory, books, categories, isLoading]);

  const ThumbnailRenderer = (props) => {
    const url = props.value;
    return url ? (
      <img
        src={url}
        alt="cover"
        style={{ height: "60px", width: "auto", borderRadius: "4px", objectFit: "cover" }}
      />
    ) : (
      <div style={{ fontStyle: "italic", color: "#999" }}>No image</div>
    );
  };  

  const columns = [
    {
      headerName: "",
      field: "coverImageUrl",
      width: 100,
      cellRenderer: ThumbnailRenderer,
      sortable: false,
      filter: false,
    },
    { headerName: "Name", field: "bookName", sortable: true, flex: 1 },
    { headerName: "Author", field: "author", sortable: true, flex: 1 },
    {
      headerName: "Category",
      field: "categories",
      sortable: true,
      valueGetter: (params) =>
        Array.isArray(params.data.categories)
          ? params.data.categories.map((id) => categories[id] || "Unknown").join(", ")
          : "",
    },
  ];  

  return (
    <div className="books-page" style={{background: "url('/library2.jpg') no-repeat center center/cover"}}>
      <div className="books">
        <div className="search-bar-container">
          <div className="search-box-all">
            <select 
              className="filter-dropdown" 
              value={selectedCategory} 
              onChange={handleCategoryChange}
              disabled={isLoading}
            >
              <option value="bookName">Book</option>
              <option value="author">Author</option>
              <option value="categories">Category</option>
            </select>
            <input 
              type="text" 
              placeholder={isLoading ? "Loading..." : "Search..."}
              value={searchQueryResult} 
              onChange={handleQueryChange}  
              readOnly={isLoading}
            />
          </div>
        </div>

        <div className="ag-theme-quartz" style={{ width: "90%", height: "70vh"}}>
          <AgGridReact
            suppressNoRowsOverlay
            ref={gridRef}
            rowData={!isLoading ? filteredBooks : null}
            rowHeight={80}
            columnDefs={columns} 
            pagination={true} 
            paginationPageSize={20}
            onGridReady={(params) => {
              gridRef.current = params;
              setGridReady(true);
            }}
            onRowClicked={(event) => {
              const bookId = event.data._id;
              const page = gridRef.current.api.paginationGetCurrentPage();
              const index = filteredBooks.findIndex((b) => b._id === bookId);
            
              sessionStorage.setItem(
                "booksGridState",
                JSON.stringify({ page })
              );
              history.push({
                pathname: `/book/${bookId}`,
                state: {
                  filteredBooks,
                  index
                }
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Allbooks;
