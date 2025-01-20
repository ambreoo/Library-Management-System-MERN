import { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule, AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
import "./Allbooks.css";

ModuleRegistry.registerModules([ ClientSideRowModelModule, AllCommunityModule]); 

// Mark all grids as using legacy themes
provideGlobalGridOptions({ theme: "legacy"});

function Allbooks() {
  const API_URL = "http://localhost:3001/";
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getallBooks = async () => {
      const response = await axios.get(API_URL + "api/books/allbooks");
      setBooks(response.data);
    };

    const getAllCategories = async () => {
      try {
        const response = await axios.get(API_URL + "api/categories/allcategories");
        const categoryMap = response.data.reduce((map, category) => {
          map[category._id] = category.categoryName;
          return map;
        }, {});
        setCategories(categoryMap);
      } catch (err) {
        console.log(err);
      }
    };
    getallBooks();
    getAllCategories();
  }, [API_URL]);

  // Define columns for AG Grid
  const columns = [
    { headerName: "Name", field: "bookName", sortable: true, filter: true, flex: 1},
    { headerName: "Author", field: "author", sortable: true, filter: true, flex: 1},
    {
      headerName: "Category",
      field: "categories",
      sortable: true,
      filter: true,
      valueGetter: (params) =>
        params.data.categories.map((id) => categories[id]).join(", "),
    },
  ];

  return (
    <div className="books-page">
      <div className="books">
        <div className="ag-theme-quartz" style={{ width: "90%", height: "85vh", margin: "auto"}}>
          <AgGridReact rowData={books} columnDefs={columns} pagination={true} paginationPageSize={20}/>
        </div>
      </div>
    </div>
  );
}

export default Allbooks;