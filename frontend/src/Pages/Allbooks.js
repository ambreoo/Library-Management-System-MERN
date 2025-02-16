import { useEffect, useState, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom"; 
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule, AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
import "./Allbooks.css";

ModuleRegistry.registerModules([ClientSideRowModelModule, AllCommunityModule]); 
provideGlobalGridOptions({ theme: "legacy" });

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Allbooks() {
  const API_URL = process.env.REACT_APP_API_URL;
  const history = useHistory();
  const queryParams = useQuery();
  const gridRef = useRef(null); // Grid reference

  const [selectedCategory, setSelectedCategory] = useState(queryParams.get("category") || "bookName");
  const [searchQueryResult, setSearchQueryResult] = useState(queryParams.get("query") || "");
  const [books, setBooks] = useState([]);  
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState({});
  const [gridReady, setGridReady] = useState(false); // Ensure grid is initialized
  const [isLoading, setIsLoading] = useState(true); // Track if data is loading

  // Function to update URL dynamically
  const updateURL = (query, category) => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (category) params.set("category", category);
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

  // Listen for URL changes
  useEffect(() => {
    setSelectedCategory(queryParams.get("category") || "bookName");
    setSearchQueryResult(queryParams.get("query") || "");
  }, [queryParams]);

  // Fetch books only when the grid is ready
  useEffect(() => {
    const getAllBooks = async () => {
      if (!gridReady || !gridRef.current?.api) return;

      gridRef.current.api.showLoadingOverlay(); // Ensure loading overlay is shown
      setIsLoading(true); // Keep loading state active

      try {
        const response = await axios.get(`${API_URL}api/books/allbooks`);
        
        setTimeout(() => {
          setBooks(response.data);
          setFilteredBooks(response.data); // Ensure books are displayed immediately
          setIsLoading(false); // Mark loading as complete

          if (gridRef.current?.api) {
            gridRef.current.api.hideOverlay(); // Hide loading overlay only when books are ready
          }
        }, 300);
      } catch (error) {
        console.error("Error fetching books:", error);
        setIsLoading(false);
      }
    };

    getAllBooks();
  }, [API_URL, gridReady]);

  // Filter books dynamically
  useEffect(() => {
    if (isLoading) return; // Prevent flickering while loading

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

  // Define columns for AG Grid
  const columns = [
    { headerName: "Name", field: "bookName", sortable: true, flex: 1 },
    { headerName: "Author", field: "author", sortable: true, flex: 1 },
    {
      headerName: "Category",
      field: "categories",
      sortable: true,
      valueGetter: (params) =>
        params.data.categories?.map((id) => categories[id]).join(", ") || "",
    },
  ];

  return (
    <div className="books-page">
      <div className="books">
        <div className="search-bar-container">
          <div className="search-box">
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
              placeholder={isLoading ? "Loading..." : "Search..."} // Change placeholder while loading
              value={searchQueryResult} 
              onChange={handleQueryChange}  
              readOnly={isLoading}
            />
          </div>
        </div>

        {/* AG Grid - Use `onGridReady` to ensure proper initialization */}
        <div className="ag-theme-quartz" style={{ width: "90%", height: "80vh", margin: "auto"}}>
          <AgGridReact 
            ref={gridRef}
            rowData={isLoading ? [] : filteredBooks}
            columnDefs={columns} 
            pagination={true} 
            paginationPageSize={20}
            onGridReady={(params) => {
              gridRef.current = params;
              setGridReady(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Allbooks;
