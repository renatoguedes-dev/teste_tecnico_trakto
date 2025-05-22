// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("image-optimization");

// Find all documents in the imagetasks collection
db.imagetasks.find();

// Find documents with a specific status
db.imagetasks.find({ status: "PENDING" });