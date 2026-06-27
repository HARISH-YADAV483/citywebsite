require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));
app.use(express.json());

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "mallitibba-blogs",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 1200, height: 800, crop: "limit", quality: "auto" }],
    },
});
const upload = multer({ storage });

// Database connection
const connectdb = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mallitiba";
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

connectdb();

// Blog Schema & Model
const BlogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: String, required: true },
        likes: { type: Number, default: 0 },
        image: { type: String, default: "" },
        contact: { type: String, default: "" },
    },
    { timestamps: true }
);

const Blog = mongoose.model("Blog", BlogSchema);

// ── Routes ───────────────────────────────────────────────────

// Health check
app.get("/", (req, res) => {
    res.send("Backend is running securely!");
});

// GET all blogs (sorted by likes desc)
app.get("/api/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ likes: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

// GET top 3 blogs by likes (must be before /:id to avoid param collision)
app.get("/api/blogs/top", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ likes: -1 }).limit(3);
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch top blogs" });
    }
});

// GET single blog by ID
app.get("/api/blogs/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch blog" });
    }
});

// POST create a new blog (with image upload)
app.post("/api/blogs", upload.single("image"), async (req, res) => {
    try {
        const { title, content, author, contact } = req.body;
        const imageUrl = req.file ? req.file.path : "";

        const blog = new Blog({
            title,
            content,
            author,
            contact,
            image: imageUrl,
            likes: 0,
        });

        await blog.save();
        res.status(201).json(blog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to publish blog" });
    }
});

// PATCH like a blog
app.patch("/api/blogs/:id/like", async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true }
        );
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: "Failed to like blog" });
    }
});

// Start Server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});