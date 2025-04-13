import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { AuthContext } from '../../../../Context/AuthContext';
import '../AdminDashboard.css';

function Return() {
    const API_URL = process.env.REACT_APP_API_URL;
    const { user } = useContext(AuthContext);

    const [allTransactions, setAllTransactions] = useState([]);

    useEffect(() => {
        const getAllTransactions = async () => {
        try {
            const response = await axios.get(API_URL + "api/transactions/all-transactions");
            setAllTransactions(response.data);
        } catch (err) {
            console.log(err);
        }
        };
        getAllTransactions();
    }, [API_URL]);

    const overdueGroupedByUser = allTransactions
        .filter(tx =>
        tx.transactionType === "Issued" &&
        tx.transactionStatus === "Ready" &&
        new Date(tx.toDate) < new Date()
        )
        .reduce((acc, tx) => {
        if (!acc[tx.borrowerId]) {
            acc[tx.borrowerId] = {
            borrowerName: tx.borrowerName,
            borrowerEmail: tx.borrowerEmail,
            books: []
            };
        }
        acc[tx.borrowerId].books.push(tx);
        return acc;
        }, {});

    const sendNotification = async (email, name, books) => {
        try {
            await axios.post(API_URL + "api/transactions/overdue-email", {
                to: email,
                subject: "Library Notice: Overdue Books",
                text: `Hello ${name},\n\nYou have the following overdue book(s):\n\n` +
                    books.map(b => `• ${b.bookName} (Due: ${moment(b.toDate).format("MMM DD, YYYY")})`).join("\n") +
                    `\n\nPlease return them as soon as possible.\n\nThank you!`
            });
            alert("Notification sent to " + email);
        } catch (err) {
            console.error("Failed to send email:", err);
            alert("Failed to send email");
        }
    };

    return (
        <div className="return-container">
        <h2 className="overdue-heading">Users with Overdue Books</h2>
        {Object.entries(overdueGroupedByUser).length === 0 ? (
            <p>No overdue books 🎉</p>
        ) : (
            Object.entries(overdueGroupedByUser).map(([userId, userData]) => (
            <div key={userId} className="overdue-user-card">
                <h4>{userData.borrowerName}</h4>
                <table>
                <thead>
                    <tr>
                    <th>Book</th>
                    <th>Due Date</th>
                    <th>Days Overdue</th>
                    </tr>
                </thead>
                <tbody>
                    {userData.books.map((book, i) => {
                    const daysLate = Math.floor((Date.now() - new Date(book.toDate)) / 86400000);
                    return (
                        <tr key={i}>
                        <td>{book.bookName}</td>
                        <td>{moment(book.toDate).format("MMM DD, YYYY")}</td>
                        <td>{daysLate}</td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>
                <button onClick={() => sendNotification(userData.borrowerEmail, userData.borrowerName, userData.books)}>
                Notify User
                </button>
            </div>
            ))
        )}
        </div>
    );
}

export default Return;
