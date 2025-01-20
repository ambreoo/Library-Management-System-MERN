import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
// don't want to use this?
// have a look at the Quick start guide 
// for passing in lng and translations on init

const resources = {
    en: {
      translation: {
        signin: {
            title: "Log in",
            question: "Are you a Staff member?",
            studentID: "Admission ID",
            enterStudentID: "Enter Admission ID",
            staffID: "Employee ID",
            enterstaffID: "Enter Employee ID",
            password: "Password",
            enterPassword: "Enter Password",
            forgotPassword: "Forgot password?",
            noAccount: "Don't have an account? Contact Librarian"
        },
        header: {
            title: "LIBRARY",
            home: "Home",
            books: "Books",
            signin: "Sign In"
        },
        dashboard: {
            profile: "Profile",
            addEditBook: "Add / Edit Book",
            transaction: "Add Transaction",
            getMember: "Get Member",
            addMember: "Add Member",
            logout: "Log out"
        },
        profile: {

        },
        addEditBook: {
            addEditBook: "Add / Edit a Book",
            selectBook: "Select Book",
            bookName: "Book Name",
            congressCode: "Congress Code",
            originalCode: "Original Code",
            authorName: "Author Name",
            publisher: "Publisher",
            copies: "No.of Copies Available",
            categories: "Categories",
            submit: "SUBMIT",
            recentlyAdded: "Recently Added Books",
            date: "Added Date"
        },
        transaction: {
            addTransaction: "Add a Transaction",
            name: "Name",
            borrower: "Borrower",
            selectMember: "Select Member",
            bookName: "Book Name",
            selectBook: "Select a Book",
            type: "Transaction Type",
            selectTrans: "Select Transaction",
            reserve: "Reserve",
            issue: "Issue",
            transaction: "Transaction",
            copies: "Available Coipes",
            reserved: "Reserved",
            fromDate: "From Date",
            toDate: "To Date",
            submit: "SUBMIT",
            recentTrans: "Recent Transactions",
            borrowerName: "Borrower Name",
            date: "Date"
        },
        getMember: {
            selectMember: "Select Member",
            age: "Age",
            gender: "Gender",
            dob: "DOB",
            address: "Address",
            issue: "Issued",
            reserve: "Reserved",
            history: "History",
            bookName: "Book-Name",
            fromDate: "From Date",
            toDate: "To Date",
            returnDate: "Return Date",
            convert: "Convert",
            return: "Return"
        },
        addMember: {
            add: "Add a Member",
            type: "User Type",
            name: "Full Name",
            employeeID: "Employee Id",
            admissionID: "Admission Id",
            mobile: "Mobile Number",
            gender: "Gender",
            age: "Age",
            dob: "Date of Birth",
            address: "Address",
            email: "Email",
            password: "Password",
            memberType: "Member Type",
            memberID: "Member ID",
            memberName: "Member Name",
            submit: "SUBMIT"
        },
      }
    },
    zh: {
      translation: {
        signin: {
            title: "登入",
            question: "您是工作人員嗎？",
            studentID: "學號",
            enterStudentID: "輸入學號",
            staffID: "員工號",
            enterstaffID: "輸入員工號",
            password: "密碼",
            enterPassword: "輸入密碼",
            forgotPassword: "忘記密碼？",
            noAccount: "還沒有帳號？請聯繫管理員"
        },
        header: {
            title: "圖書館",
            home: "主頁",
            books: "書籍",
            signin: "登入"
        },
        dashboard: {
            profile: "個人資料",
            addEditBook: "新增 / 編輯 書籍",
            transaction: "借閱書籍",
            getMember: "查詢帳號",
            addMember: "新增帳號",
            logout: "登出"
        },
        profile: {

        },
        addEditBook: {
            addEditBook: "新增 / 編輯 書籍",
            selectBook: "選擇書籍",
            bookName: "書名",
            congressCode: "Congress Code",
            originalCode: "原始碼",
            authorName: "作者",
            publisher: "出版社",
            copies: "數量",
            categories: "類別",
            submit: "送出",
            recentlyAdded: "最近新增書籍",
            date: "新增日期"
        },
        transaction: {
            addTransaction: "新增借閱",
            name: "名字",
            borrower: "借閱人",
            selectMember: "選擇帳號",
            bookName: "書籍名稱",
            selectBook: "選擇書籍",
            type: "借閱種類",
            selectTrans: "選擇種類",
            reserve: "預定 (Reserved)",
            issue: "分發 (Issued)",
            transaction: "借閱",
            copies: "剩餘數量",
            reserved: "預定",
            fromDate: "起始日期",
            toDate: "結束日期",
            submit: "送出",
            recentTrans: "最近借閱",
            borrowerName: "借閱人",
            date: "日期"
        },
        getMember: {
            selectMember: "選擇帳號",
            age: "年齡",
            gender: "性別",
            dob: "生日",
            address: "地址",
            issue: "分發",
            reserve: "預定",
            history: "歷史紀錄",
            bookName: "書籍名稱",
            fromDate: "起始日期",
            toDate: "結束日期",
            returnDate: "還書日期",
            convert: "轉移",
            return: "還書"
        },
        addMember: {
            add: "新增帳號",
            type: "使用者類別",
            name: "全名",
            employeeID: "員工號 (Employee ID)",
            admissionID: "學號 (Student ID)",
            mobile: "手機號碼",
            gender: "性別",
            age: "年齡",
            dob: "生日",
            address: "地址",
            email: "信箱",
            password: "密碼",
            memberType: "使用者類別",
            memberID: "使用者ID",
            memberName: "使用者名字",
            submit: "送出"
        },
      }
    }
  };

i18n
  .use(HttpApi)
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });


export default i18n;