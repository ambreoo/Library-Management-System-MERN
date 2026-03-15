import express from "express";
import fetch from "node-fetch";
import Book from "../models/Book.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // basic search against your library DB
    const books = await Book.find({
      $or: [
        { bookName: { $regex: message, $options: "i" } },
        { author: { $regex: message, $options: "i" } },
        { publisher: { $regex: message, $options: "i" } },
        { categories: { $regex: message, $options: "i" } },
      ],
    }).limit(5);

    const libraryContext =
      books.length > 0
        ? books
            .map(
              (book, index) =>
                `${index + 1}. Title: ${book.bookName}
Author: ${book.author}
Publisher: ${book.publisher}
Category: ${book.categories}
Available Copies: ${book.bookCountAvailable}`
            )
            .join("\n\n")
        : "No matching books found in the library database.";

    const prompt = `
You are a helpful library assistant for CUSV Library.

Use the library data below when answering.
If the user asks for recommendations, recommend only from the provided library data.
If no matching books are found, say so clearly and politely.

Library data:
${libraryContext}

User question:
${message}

Answer naturally and concisely.
`;

    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false,
      }),
    });

    const data = await ollamaRes.json();

    return res.status(200).json({
      reply: data.response || "Sorry, I could not generate a response.",
      matchedBooks: books,
    });
  } catch (err) {
    console.error("Chat route error:", err);
    return res.status(500).json({ error: "Failed to process chat request" });
  }
});

export default router;