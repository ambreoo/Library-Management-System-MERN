import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { Dropdown } from 'semantic-ui-react'
import '../../MemberDashboard/MemberDashboard.css'
import { AuthContext } from '../../../../Context/AuthContext'
import moment from "moment"
import { useTranslation } from 'react-i18next';

function GetMember() {

    // const API_URL = process.env.REACT_APP_API_URL
    const API_URL = "http://localhost:3001/"
    const { user } = useContext(AuthContext)
    const [allMembersOptions, setAllMembersOptions] = useState(null)
    const [allTransactions, setAllTransactions] = useState([])
    const [ExecutionStatus, setExecutionStatus] = useState(null)
    const [memberId, setMemberId] = useState(null)
    const [memberDetails, setMemberDetails] = useState(null)
    const { t } = useTranslation();

    //Fetch Members
    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await axios.get(API_URL + "api/users/allmembers")
                setAllMembersOptions(response.data.map((member) => (
                    { value: `${member?._id}`, text: `${member?.userType === "Student" ? `${member?.userFullName}[${member?.admissionId}]` : `${member?.userFullName}[${member?.employeeId}]`}` }
                )))
            }
            catch (err) {
                console.log(err)
            }
        }
        getMembers()
    }, [API_URL])


    useEffect(() => {
        const getMemberDetails = async () => {
            if(memberId !== null){
                try {
                    const response = await axios.get(API_URL + "api/users/getuser/" + memberId)
                    setMemberDetails(response.data)
                }
                catch (err) {
                    console.log("Error in fetching the member details")
                }
            }
        }
        getMemberDetails()

        const getAllTransactions = async () =>{
            try{
                const response = await axios.get(API_URL+"api/transactions/all-transactions")
                setAllTransactions(response.data.sort((a, b) => Date.parse(a.toDate) - Date.parse(b.toDate)).filter((data) => {
                    return data.transactionStatus === "Active"
                }))
                console.log("Okay")
                setExecutionStatus(null)
            }
            catch(err){
                console.log(err)
            }
        }
        getAllTransactions()
    }, [API_URL, memberId, ExecutionStatus])

    const convertToIssue = async (transactionId) => {
        try{
            await axios.put(API_URL+"api/transactions/update-transaction/"+transactionId,{
                transactionType:"Issued",
                isAdmin:user.isAdmin
            })
            setExecutionStatus("Completed");
            alert("Book issued succesfully 🎆")
        }
        catch(err){
            console.log(err)
        }
    }


    const returnBook = async (transactionId,borrowerId,bookId,due) =>{
        try{
            /* Setting return date and transactionStatus to completed */
            await axios.put(API_URL+"api/transactions/update-transaction/"+transactionId,{
                isAdmin:user.isAdmin,
                transactionStatus:"Completed",
                returnDate:moment(new Date()).format("MM/DD/YYYY")
            })

            /* Getting borrower points alreadt existed */
            const borrowerdata = await axios.get(API_URL+"api/users/getuser/"+borrowerId)
            // const points = borrowerdata.data.points

            // /* If the number of days after dueDate is greater than zero then decreasing points by 10 else increase by 10*/
            // if(due > 0){
            //     await axios.put(API_URL+"api/users/updateuser/"+borrowerId,{
            //         points:points-10,
            //         isAdmin: user.isAdmin
            //     })
            // }
            // else if(due<=0){
            //     await axios.put(API_URL+"api/users/updateuser/"+borrowerId,{
            //         points:points+10,
            //         isAdmin: user.isAdmin
            //     })
            // }

            const book_details = await axios.get(API_URL+"api/books/getbook/"+bookId)
            await axios.put(API_URL+"api/books/updatebook/"+bookId,{
                isAdmin:user.isAdmin,
                bookCountAvailable:book_details.data.bookCountAvailable + 1
            })

            /* Pulling out the transaction id from user active Transactions and pushing to Prev Transactions */
            await axios.put(API_URL + `api/users/${transactionId}/move-to-prevtransactions`, {
                userId: borrowerId,
                isAdmin: user.isAdmin
            })

            setExecutionStatus("Completed");
            alert("Book returned to the library successfully")
        }
        catch(err){
            console.log(err)
        }
    }


    return (
        <div>
            <div className='semanticdropdown getmember-dropdown'>
                <Dropdown
                    placeholder={t('getMember.selectMember')}
                    fluid
                    search
                    selection
                    value={memberId}
                    options={allMembersOptions}
                    onChange={(event, data) => setMemberId(data.value)}
                />
            </div>
            <div style={memberId === null ? { display: "none" } : {}}>
                <div className="member-profile-content" id="profile@member" style={memberId === null ? { display: "none" } : {}}>
                    <div className="user-details-topbar">
                        <img className="user-profileimage" src="./assets/images/Profile.png" alt=""></img>
                        <div className="user-info">
                            <p className="user-name">{memberDetails?.userFullName}</p>
                            <p className="user-id">{memberDetails?.userType === "Student" ? memberDetails?.admissionId : memberDetails?.employeeId}</p>
                            <p className="user-email">{memberDetails?.email}</p>
                            <p className="user-phone">{memberDetails?.mobileNumber}</p>
                        </div>
                    </div>
                    <div className="user-details-specific">
                        <div className="specific-left">
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <p style={{ display: "flex", flex: "0.5", flexDirection: "column" }}>
                                    <span style={{ fontSize: "18px" }}>
                                        <b>{t('getMember.age')}</b>
                                    </span>
                                    <span style={{ fontSize: "16px" }}>
                                    {memberDetails?.age}
                                    </span>
                                </p>
                                <p style={{ display: "flex", flex: "0.5", flexDirection: "column" }}>
                                    <span style={{ fontSize: "18px" }}>
                                        <b>{t('getMember.gender')}</b>
                                    </span>
                                    <span style={{ fontSize: "16px" }}>
                                    {memberDetails?.gender}
                                    </span>
                                </p>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
                                <p style={{ display: "flex", flex: "0.5", flexDirection: "column" }}>
                                    <span style={{ fontSize: "18px" }}>
                                        <b>{t('getMember.dob')}</b>
                                    </span>
                                    <span style={{ fontSize: "16px" }}>
                                        {memberDetails?.dob}
                                    </span>
                                </p>
                                <p style={{ display: "flex", flex: "0.5", flexDirection: "column" }}>
                                    <span style={{ fontSize: "18px" }}>
                                        <b>{t('getMember.address')}</b>
                                    </span>
                                    <span style={{ fontSize: "16px" }}>
                                        {memberDetails?.address}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="specific-right">
                            <div style={{ display: "flex", flexDirection: "column", flex: "0.5" }}>
                                <p style={{ fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}><b>Points</b></p>
                                <p style={{ fontSize: "25px", fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "15px" }}>540</p>
                            </div>
                            <div className="dashboard-title-line"></div>
                            <div style={{ display: "flex", flexDirection: "column", flex: "0.5" }}>
                                <p style={{ fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}><b>Rank</b></p>
                                <p style={{ fontSize: "25px", fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "15px" }}>{memberDetails?.points}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="member-activebooks-content" id="activebooks@member">
                    <p style={{ fontWeight: "bold", fontSize: "22px", marginTop: "22px", marginBottom: "22px" }}>{t('getMember.issue')}</p>
                    <table className="activebooks-table">
                        <tr>
                            <th>S.No</th>
                            <th>{t('getMember.bookName')}</th>
                            <th>{t('getMember.fromDate')}</th>
                            <th>{t('getMember.toDate')}</th>
                            {/* <th>Fine</th> */}
                            <th></th>
                        </tr>
                        {
                            memberDetails?.activeTransactions?.filter((data) => {
                                return data.transactionType === "Issued"
                            }).map((data, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{data.bookName}</td>
                                        <td>{data.fromDate}</td>
                                        <td>{data.toDate}</td>
                                        <td><button onClick={()=>{returnBook(data._id,data.borrowerId,data.bookId,(Math.floor(( Date.parse(moment(new Date()).format("MM/DD/YYYY")) - Date.parse(data.toDate) ) / 86400000)))}}>{t('getMember.return')}</button></td>
                                        {/* <td>{(Math.floor((Date.parse(moment(new Date()).format("MM/DD/YYYY")) - Date.parse(data.toDate)) / 86400000)) <= 0 ? 0 : (Math.floor((Date.parse(moment(new Date()).format("MM/DD/YYYY")) - Date.parse(data.toDate)) / 86400000)) * 10}</td> */}
                                    </tr>
                                )
                            })
                        }
                    </table>
                </div>

                <div className="member-reservedbooks-content" id="reservedbooks@member">
                    <p style={{ fontWeight: "bold", fontSize: "22px", marginTop: "22px", marginBottom: "22px" }}>{t('getMember.reserve')}</p>
                    <table className="activebooks-table">
                        <tr>
                            <th>S.No</th>
                            <th>{t('getMember.bookName')}</th>
                            <th>{t('getMember.fromDate')}</th>
                            <th>{t('getMember.toDate')}</th>
                            <th></th>
                        </tr>
                        {
                            memberDetails?.activeTransactions?.filter((data) => {
                                return data.transactionType === "Reserved"
                            }).map((data, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{data.bookName}</td>
                                        <td>{data.fromDate}</td>
                                        <td>{data.toDate}</td>
                                        <td><button onClick={()=>{convertToIssue(data._id)}}>{t('getMember.convert')}</button></td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                </div>
                <div className="member-history-content" id="history@member">
                    <p style={{ fontWeight: "bold", fontSize: "22px", marginTop: "22px", marginBottom: "22px" }}>{t('getMember.history')}</p>
                    <table className="activebooks-table">
                        <tr>
                            <th>S.No</th>
                            <th>{t('getMember.bookName')}</th>
                            <th>{t('getMember.fromDate')}</th>
                            <th>{t('getMember.toDate')}</th>
                            <th>{t('getMember.returnDate')}</th>
                        </tr>
                        {
                            memberDetails?.prevTransactions?.map((data, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{data.bookName}</td>
                                        <td>{data.fromDate}</td>
                                        <td>{data.toDate}</td>
                                        <td>{data.returnDate}</td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                </div>
            </div>
        </div>
    )
}

export default GetMember
