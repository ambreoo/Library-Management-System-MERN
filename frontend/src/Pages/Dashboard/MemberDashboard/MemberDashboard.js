import React, { useContext, useEffect, useState } from "react";
import "../AdminDashboard/AdminDashboard.css";
import "./MemberDashboard.css";

import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import BookIcon from "@material-ui/icons/Book";
import HistoryIcon from "@material-ui/icons/History";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import CloseIcon from "@material-ui/icons/Close";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import { IconButton } from "@material-ui/core";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";
import moment from "moment";
import { useTranslation } from 'react-i18next';

function MemberDashboard() {
  const { t } = useTranslation();
  const [active, setActive] = useState("profile");
  const [sidebar, setSidebar] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const { user } = useContext(AuthContext);
  const [memberDetails, setMemberDetails] = useState(null);
  const [booksOnHoldMap, setBooksOnHoldMap] = useState({});

  useEffect(() => {
    const fetchBooksOnHold = async () => {
      if (!memberDetails?.activeTransactions) return;
  
      const reservedBooks = memberDetails.activeTransactions.filter(
        (tx) => tx.transactionType === "Reserved"
      );
  
      const newMap = {};
      for (const tx of reservedBooks) {
        try {
          const res = await axios.get(API_URL + "api/books/getbook/" + tx.bookId);
          newMap[tx.bookId] = res.data.bookOnHold;
        } catch (err) {
          console.error("Error fetching bookOnHold for", tx.bookId);
        }
      }
  
      setBooksOnHoldMap(newMap);
    };
  
    fetchBooksOnHold();
  }, [memberDetails, API_URL]);  

  useEffect(() => {
    const getMemberDetails = async () => {
      try {
        const response = await axios.get(
          API_URL + "api/users/getuser/" + user._id
        );
        setMemberDetails(response.data);
      } catch (err) {
        console.log("Error in fetching the member details");
      }
    };
    getMemberDetails();
  }, [API_URL, user]);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-bg"></div>
      <div className="dashboard-overlay"></div> 
        <div className="dashboard">
          <div className="dashboard-card">
            <div className="sidebar-toggler" onClick={() => setSidebar(!sidebar)}>
              <IconButton>
                {sidebar ? (
                  <CloseIcon style={{ fontSize: 25, color: "rgb(234, 68, 74)" }} />
                ) : (
                  <DoubleArrowIcon
                    style={{ fontSize: 25, color: "rgb(234, 68, 74)" }}
                  />
                )}
              </IconButton>
            </div>
            <div
              className={sidebar ? "dashboard-options active" : "dashboard-options"}
            >
              <div className="dashboard-logo">
                <LibraryBooksIcon style={{ fontSize: 50 }} />
                <p className="logo-name">CUSV</p>
              </div>
              <a
                href="#profile@member"
                className={`dashboard-option ${
                  active === "profile" ? "clicked" : ""
                }`}
                onClick={() => {
                  setActive("profile");
                  setSidebar(false);
                }}
              >
                <AccountCircleIcon className="dashboard-option-icon" /> {t('dashboard.profile')}
              </a>
              <a
                href="#profile@member"
                className={`dashboard-option ${
                  active === "logout" ? "clicked" : ""
                }`}
                onClick={() => {
                  logout();
                  setSidebar(false);
                }}
              >
                <PowerSettingsNewIcon className="dashboard-option-icon" /> {t('dashboard.logout')}{" "}
              </a>
            </div>

            <div className="dashboard-option-content">
              <div className="member-profile-content" id="profile@member">
                <div className="user-details-topbar">
                  <img
                    className="user-profileimage"
                    src="./assets/images/Profile.png"
                    alt=""
                  ></img>

                  <div className="specific-left">
                    <div className="specific-left-top">
                      <p className="specific-left-topic">
                        <span style={{ fontSize: "18px" }}>
                          <b>{t('getMember.age')}</b>
                        </span>
                        <span style={{ fontSize: "16px" }}>
                          {memberDetails?.age}
                        </span>
                      </p>
                      <p className="specific-left-topic">
                        <span style={{ fontSize: "18px" }}>
                          <b>{t('getMember.gender')}</b>
                        </span>
                        <span style={{ fontSize: "16px" }}>
                          {memberDetails?.gender}
                        </span>
                      </p>
                    </div>
                    <div className="specific-left-bottom">
                      <p className="specific-left-topic">
                        <span style={{ fontSize: "18px" }}>
                          <b>{t('getMember.dob')}</b>
                        </span>
                        <span style={{ fontSize: "16px" }}>
                          {memberDetails?.dob}
                        </span>
                      </p>
                      <p className="specific-left-topic">
                        <span style={{ fontSize: "18px" }}>
                          <b>{t('getMember.address')}</b>
                        </span>
                        <span style={{ fontSize: "16px" }}>
                          {memberDetails?.address}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="user-info">
                    <p className="user-name">{memberDetails?.userFullName}</p>
                    <p className="user-id">
                      {memberDetails?.userType === "Student"
                        ? memberDetails?.admissionId
                        : memberDetails?.employeeId}
                    </p>
                    <p className="user-email">{memberDetails?.email}</p>
                    <p className="user-phone">{memberDetails?.mobileNumber}</p>
                  </div>
                </div>
                <div className="user-details-specific">
                </div>
              </div>

              <div className="member-activebooks-content" id="activebooks@member">
                <p className="member-dashboard-heading">{t('getMember.issue')}</p>
                <table className="activebooks-table">
                  <tr>
                    <th>S.No</th>
                    <th>{t('getMember.bookName')}</th>
                    <th>{t('getMember.fromDate')}</th>
                    <th>{t('getMember.toDate')}</th>
                    {/* <th>Fine</th> */}
                  </tr>
                  {memberDetails?.activeTransactions
                    ?.filter((data) => {
                      return data.transactionType === "Issued";
                    })
                    .map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data.bookName}</td>
                          <td>{data.fromDate}</td>
                          <td>{data.toDate}</td>
                        </tr>
                      );
                    })}
                </table>
              </div>

              <div
                className="member-reservedbooks-content"
                id="reservedbooks@member"
              >
                <p className="member-dashboard-heading">{t('getMember.reserve')}</p>
                <table className="activebooks-table">
                  <tr>
                    <th>S.No</th>
                    <th>{t('getMember.bookName')}</th>
                    {/* <th>{t('getMember.fromDate')}</th>
                    <th>{t('getMember.toDate')}</th> */}
                    <th>No. On Hold</th>
                    <th>Action</th>
                  </tr>
                  {memberDetails?.activeTransactions
                    ?.filter((data) => data.transactionType === "Reserved")
                    .map((data, index) => {
                      const holdList = booksOnHoldMap[data.bookId] || [];
                      const userIndex = holdList.findIndex((id) => id === memberDetails._id);

                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data.bookName}</td>
                          <td>{userIndex + 1}</td>
                          <td>
                          <button
                            className="remove-hold-button"
                            onClick={async () => {
                              try {
                                await axios.delete(API_URL + `api/transactions/remove-transaction/${data._id}`, {
                                  data: {
                                    userId: memberDetails._id,
                                  }
                                });
                                await axios.put(API_URL + `api/books/remove-from-holdlist/${data.bookId}`, {
                                  userId: memberDetails._id,
                                });
                                await axios.put(API_URL + `api/users/cancel-transaction/${memberDetails._id}`, {
                                  transactionId: data._id
                                });                                
                                
                                alert("Reservation canceled successfully ✅");
                              } catch (err) {
                                console.error("Failed to cancel reservation", err);
                                alert("Failed to cancel reservation ❌");
                              }
                            }}
                          >
                            Remove
                          </button>
                          </td>
                        </tr>
                      );
                    })}
                </table>
              </div>
              <div className="member-history-content" id="history@member">
                <p className="member-dashboard-heading">{t('getMember.history')}</p>
                <table className="activebooks-table">
                  <tr>
                    <th>S.No</th>
                    <th>{t('getMember.bookName')}</th>
                    <th>{t('getMember.fromDate')}</th>
                    <th>{t('getMember.toDate')}</th>
                    <th>{t('getMember.returnDate')}</th>
                  </tr>
                  {memberDetails?.prevTransactions?.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data.bookName}</td>
                        <td>{data.fromDate}</td>
                        <td>{data.toDate}</td>
                        <td>{data.returnDate}</td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default MemberDashboard;
