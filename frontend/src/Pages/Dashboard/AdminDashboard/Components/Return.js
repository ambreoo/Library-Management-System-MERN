import React, { useContext, useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import moment from 'moment';
import { AuthContext } from '../../../../Context/AuthContext';
import '../AdminDashboard.css';

function Return() {
  const API_URL = process.env.REACT_APP_API_URL;
  const { user } = useContext(AuthContext);

  const [overdueTransactions, setOverdueTransactions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
        try {
            const res = await axios.get(API_URL + 'api/transactions/overdue-only');
            setOverdueTransactions(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    fetchTransactions();
}, [API_URL]);

  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const res = await axios.get(API_URL + 'api/users/allmembers');
            setAllUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    fetchUsers();
  }, [API_URL]);

  // Group overdue transactions by user (with email)
  const overdueGroupedByUser = useMemo(() => {
    if (!overdueTransactions.length || !allUsers.length) return {};

    return overdueTransactions.reduce((acc, tx) => {
        const borrower = allUsers.find(u => String(u._id) === String(tx.borrowerId));
        if (!borrower) return acc;

        if (!acc[tx.borrowerId]) {
            acc[tx.borrowerId] = {
            borrowerName: borrower.userFullName || borrower.name || "Unknown User",
            borrowerEmail: borrower.email,
            books: []
            };
        }
        acc[tx.borrowerId].books.push(tx);
        return acc;
    }, {});
  }, [overdueTransactions, allUsers]);

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
                <p><strong>Email:</strong> {userData.borrowerEmail}</p>
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
