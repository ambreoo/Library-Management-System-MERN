import React, { useContext, useEffect, useState } from 'react'
// import { AgGridReact } from 'ag-grid-react';
// import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
// ModuleRegistry.registerModules([AllCommunityModule]);
import axios from "axios"
import "./Allbooks.css";

function AllbooksCopy() {
  const API_URL = "http://localhost:3001/"
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getallBooks = async () => {
        const response = await axios.get(API_URL + "api/books/allbooks")
        setBooks(response.data)
    }

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
  }, [API_URL])

  // const GridExample = () => {
  //   // Row Data: The data to be displayed.
  //   const [rowData, setRowData] = useState([
  //       { make: "Tesla", model: "Model Y", price: 64950, electric: true },
  //       { make: "Ford", model: "F-Series", price: 33850, electric: false },
  //       { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  //   ]);

  //   // Column Definitions: Defines the columns to be displayed.
  //   const [colDefs, setColDefs] = useState([
  //       { field: "make" },
  //       { field: "model" },
  //       { field: "price" },
  //       { field: "electric" }
  //   ]);
  // }

  // const books = [
    
  //   {"_id":{"$oid":"673d3b9b26e27394094f15b2"},"congressCode":"616 99406 1996","originalCode":"RA5.1 .L6","publisher":"Lothian Books","isbn":"850916445","categories":[{"$oid":"672816ab95924cddce4774d3"}],"bookName":"Cancer: what to do about it","author":"RAY LOWENTHAL","bookCountAvailable":{"$numberInt":"1"},"transactions":[],"createdAt":{"$date":{"$numberLong":"1732066203416"}},"updatedAt":{"$date":{"$numberLong":"1732066203416"}},"__v":{"$numberInt":"0"}},
  //   {"_id":{"$oid":"673d3b9b26e27394094f15b3"},"congressCode":"B126 F42 1966","originalCode":"BL1 .C4  F8 1966","publisher":"The Free Press","isbn":"29109809","categories":[{"$oid":"672816cc95924cddce47765c"}],"bookName":"A Short History of Chinese Philosophy","author":"Fung Yu-Lan","bookCountAvailable":{"$numberInt":"1"},"transactions":[],"createdAt":{"$date":{"$numberLong":"1732066203416"}},"updatedAt":{"$date":{"$numberLong":"1732066203416"}},"__v":{"$numberInt":"0"}},
  //   {"_id":{"$oid":"673d3b9b26e27394094f15b4"},"congressCode":"B132 Y6 S76 1993","originalCode":"RA1.6 .S7","publisher":"Bantam Books","isbn":"875545637","categories":[{"$oid":"672816d095924cddce477685"}],"bookName":"Yoga,youth and reincarnation","author":"Jess Stearn","bookCountAvailable":{"$numberInt":"1"},"transactions":[],"createdAt":{"$date":{"$numberLong":"1732066203416"}},"updatedAt":{"$date":{"$numberLong":"1732066203416"}},"__v":{"$numberInt":"0"}}
  // ];
  return (
    <div className="books-page">
      <div className="books">
        <table>
          <tr>
            <th>Name</th>
            <th>Author</th>
            <th>Category</th>
          </tr>
        
        {books.map((book) => (
          <tr key={Math.random()}>
            <td>{book.bookName}</td>
            <td>{book.author}</td>
            <td>{book.categories.map((categoryId) => categories[categoryId]).join(", ")}</td>
          </tr>
        ))}
        </table>
        
      </div>
    </div> 

    // <div style={{ height: 500 }}>
    //   <AgGridReact rowData={rowData} columnDefs={colDefs}/>
    // </div>
  );
}

export default AllbooksCopy;
