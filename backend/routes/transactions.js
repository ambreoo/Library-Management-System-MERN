import express from "express"
import Book from "../models/Book.js"
import BookTransaction from "../models/BookTransaction.js"

const router = express.Router()

router.post("/add-transaction", async (req, res) => {
    try {
        if (req.body.isAdmin === true) {
            const newtransaction = await new BookTransaction({
                bookId: req.body.bookId,
                borrowerId: req.body.borrowerId,
                bookName: req.body.bookName,
                borrowerName: req.body.borrowerName,
                transactionType: req.body.transactionType,
                fromDate: req.body.fromDate,
                toDate: req.body.toDate
            })
            const transaction = await newtransaction.save()
            const book = Book.findById(req.body.bookId)
            await book.updateOne({ $push: { transactions: transaction._id } })
            res.status(200).json(transaction)
        }
        else if (req.body.isAdmin === false) {
            res.status(500).json("You are not allowed to add a Transaction")
        }
    }
    catch (err) {
        res.status(504).json(err)
    }
})

router.get("/all-transactions", async (req, res) => {
    try {
        const transactions = await BookTransaction.find({}).sort({ _id: -1 })
        res.status(200).json(transactions)
    }
    catch (err) {
        return res.status(504).json(err)
    }
})

router.put("/update-transaction/:id", async (req, res) => {
    try {
        if (req.body.isAdmin) {
            await BookTransaction.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Transaction details updated successfully");
        }
    }
    catch (err) {
        res.status(504).json(err)
    }
})

router.delete("/remove-transaction/:id", async (req, res) => {
    try {
        const transaction = await BookTransaction.findByIdAndDelete(req.params.id);
        if (!transaction) return res.status(404).json("Transaction not found");

        res.status(200).json("Transaction deleted successfully");
    } catch (err) {
        console.error(err);
        res.status(504).json(err);
    }
});


export default router