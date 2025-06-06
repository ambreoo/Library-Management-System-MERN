import express from "express"
import Book from "../models/Book.js"
import BookCategory from "../models/BookCategory.js"
import BookTransaction from "../models/BookTransaction.js";

const router = express.Router()

// POST /api/books/add-to-holdlist/:bookId
router.post("/add-to-holdlist/:bookId", async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json("User ID is required");
        }

        const book = await Book.findById(req.params.bookId);
        if (!book) {
            return res.status(404).json("Book not found");
        }

        // Prevent duplicate entries
        if (book.bookOnHold.includes(userId)) {
            return res.status(200).json("User already on the hold list");
        }

        await book.updateOne({ $push: { bookOnHold: userId } });
        res.status(200).json("User added to book hold list");
    } catch (err) {
        console.log(err);
        res.status(504).json("Failed to update hold list");
    }
});

router.post("/convert-reservation", async (req, res) => {
    try {
        const { userId, bookId } = req.body;

        await Book.findByIdAndUpdate(bookId, {
            $pull: {
                bookOnHold: userId,
            }
        });
        return res.status(200).json("Reservation successfully converted to Issued");
    } catch (err) {
        console.error("❌ Error in convert-reservation:", err);
        return res.status(500).json("Failed to convert reservation");
    }
});  

// PUT /api/books/remove-from-holdlist/:bookId
router.put("/remove-from-holdlist/:bookId", async (req, res) => {
    try {
        const { userId } = req.body;
    
        if (!userId) {
            return res.status(400).json("User ID is required");
        }
    
        const book = await Book.findById(req.params.bookId);
        if (!book) {
            return res.status(404).json("Book not found");
        }
    
        const isUserOnHold = book.bookOnHold.includes(userId);
        if (!isUserOnHold) {
            return res.status(200).json("User was not on the hold list");
        }
    
        const transaction = await BookTransaction.findOne({
            bookId: book._id,
            borrowerId: userId,
            transactionType: "Reserved",
            transactionStatus: { $in: ["Active", "Ready"] }
        });
    
        if (!transaction) {
            return res.status(404).json("Transaction not found");
        }
    
        const update = {
            $pull: {
            bookOnHold: userId,
            transactions: transaction._id
            }
        };
    
        // ❗ Check how many are still on hold (excluding current user)
        const remainingHolds = book.bookOnHold.filter(id => id.toString() !== userId.toString());
    
        // ✅ Only increase availability if transaction was Ready AND no one else is waiting
        if (transaction.transactionStatus === "Ready" && remainingHolds.length === 0) {
            update.$inc = { bookCountAvailable: 1 };
        }
    
        await Book.findByIdAndUpdate(book._id, update);
    
        // 🔁 Promote next user in line to "Ready"
        if (remainingHolds.length > 0) {
            const nextUserId = remainingHolds[0];
            const nextTransaction = await BookTransaction.findOne({
            bookId: book._id,
            borrowerId: nextUserId,
            transactionType: "Reserved",
            transactionStatus: "Active"
            });
    
            if (nextTransaction) {
                await BookTransaction.findByIdAndUpdate(nextTransaction._id, {
                    transactionStatus: "Ready"
                });
            console.log(`📦 Promoted user ${nextUserId} to Ready`);
            }
        }
    
        return res.status(200).json(
            `User removed from hold list${
            transaction.transactionStatus === "Ready" && remainingHolds.length === 0
                ? " and availability updated"
                : ""
            }`
        );
    } catch (err) {
        console.error("❌ Error in remove-from-holdlist:", err);
        return res.status(504).json("Failed to remove user from hold list");
    }
  });  

/* Get all books in the db */
router.get("/allbooks", async (req, res) => {
    try {
        const books = await Book.find({}).populate("transactions").sort({ _id: -1 })
        res.status(200).json(books)
    }
    catch (err) {
        return res.status(504).json(err);
    }
})

/* Get Book by book Id */
router.get("/getbook/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate("transactions")
        res.status(200).json(book)
    }
    catch {
        return res.status(500).json(err)
    }
})

/* Get books by category name*/
router.get("/", async (req, res) => {
    const category = req.query.category
    try {
        const books = await BookCategory.findOne({ categoryName: category }).populate("books")
        res.status(200).json(books)
    }
    catch (err) {
        return res.status(504).json(err)
    }
})

/* Adding book */
router.post("/addbook", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const newbook = await new Book({
                bookName: req.body.bookName,
                congressCode: req.body.congressCode,
                originalCode: req.body.originalCode,
                author: req.body.author,
                bookCountAvailable: req.body.bookCountAvailable,
                isbn: req.body.isbn,
                publisher: req.body.publisher,
                coverImageUrl: req.body.coverImageUrl,
                categories: req.body.categories
            })
            const book = await newbook.save()
            await BookCategory.updateMany({ '_id': book.categories }, { $push: { books: book._id } });
            res.status(200).json(book)
        }
        catch (err) {
            res.status(504).json(err)
        }
    }
    else {
        return res.status(403).json("You dont have permission to delete a book!");
    }
})

/* Addding book */
router.put("/updatebook/:id", async (req, res) => {
    try {
        await Book.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        });
        res.status(200).json("Book details updated successfully");
    }
    catch (err) {
        res.status(504).json(err);
    }
})

/* Remove book  */
router.delete("/removebook/:id", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const _id = req.params.id
            const book = await Book.findOne({ _id })
            await book.remove()
            await BookCategory.updateMany({ '_id': book.categories }, { $pull: { books: book._id } });
            res.status(200).json("Book has been deleted");
        } catch (err) {
            return res.status(504).json(err);
        }
    } else {
        return res.status(403).json("You dont have permission to delete a book!");
    }
})

export default router