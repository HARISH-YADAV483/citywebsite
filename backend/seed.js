require("dotenv").config();
const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/malitiba";

const QuizQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true }
});
const QuizQuestion = mongoose.model("QuizQuestion", QuizQuestionSchema);

// Existing models
const BlogSchema = new mongoose.Schema({ status: { type: String, default: "pending" } }, { strict: false });
const Blog = mongoose.model("Blog", BlogSchema);

const GalleryImageSchema = new mongoose.Schema({ status: { type: String, default: "pending" } }, { strict: false });
const GalleryImage = mongoose.model("GalleryImage", GalleryImageSchema);

const PageContributionSchema = new mongoose.Schema({ status: { type: String, default: "pending" } }, { strict: false });
const PageContribution = mongoose.model("PageContribution", PageContributionSchema);

const seedData = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB");

        // 1. Seed 10 questions
        const count = await QuizQuestion.countDocuments();
        if (count === 0) {
            const questions = [
                {
                    question: "What is the primary language spoken in Mali Tibba?",
                    options: ["Hindi", "Garhwali", "Kumaoni", "English"],
                    correctAnswer: "Garhwali"
                },
                {
                    question: "Which major mountain range is closest to Mali Tibba?",
                    options: ["Himalayas", "Aravalli", "Vindhya", "Satpura"],
                    correctAnswer: "Himalayas"
                },
                {
                    question: "What is the most famous temple in Mali Tibba?",
                    options: ["Kedarnath", "Badrinath", "Mali Tibba Mahadev", "Tungnath"],
                    correctAnswer: "Mali Tibba Mahadev"
                },
                {
                    question: "Which of the following is a traditional dish of the region?",
                    options: ["Dosa", "Chainsoo", "Dhokla", "Biryani"],
                    correctAnswer: "Chainsoo"
                },
                {
                    question: "What is the main occupation of people in Mali Tibba?",
                    options: ["Fishing", "Agriculture", "Mining", "IT"],
                    correctAnswer: "Agriculture"
                },
                {
                    question: "Which festival is celebrated with maximum fervor here?",
                    options: ["Diwali", "Makar Sankranti", "Harela", "Pongal"],
                    correctAnswer: "Harela"
                },
                {
                    question: "What is the local folk dance called?",
                    options: ["Bhangra", "Chholiya", "Garba", "Kathak"],
                    correctAnswer: "Chholiya"
                },
                {
                    question: "Which river flows near Mali Tibba?",
                    options: ["Ganga", "Yamuna", "Alaknanda", "Kaveri"],
                    correctAnswer: "Alaknanda"
                },
                {
                    question: "What type of climate is generally experienced in Mali Tibba?",
                    options: ["Tropical", "Desert", "Temperate/Cold", "Equatorial"],
                    correctAnswer: "Temperate/Cold"
                },
                {
                    question: "Which tree is most commonly found in the forests of Mali Tibba?",
                    options: ["Coconut", "Pine (Chir)", "Banyan", "Mango"],
                    correctAnswer: "Pine (Chir)"
                }
            ];
            await QuizQuestion.insertMany(questions);
            console.log("Seeded 10 questions successfully.");
        } else {
            console.log("Questions already exist, skipping seed.");
        }

        // 2. Migrate existing records to verified
        const blogResult = await Blog.updateMany({ status: { $exists: false } }, { $set: { status: "verified" } });
        const blogResult2 = await Blog.updateMany({ status: "pending" }, { $set: { status: "verified" } });
        console.log(`Migrated blogs to verified. Modified: ${blogResult.modifiedCount + blogResult2.modifiedCount}`);

        const galleryResult = await GalleryImage.updateMany({ status: { $exists: false } }, { $set: { status: "verified" } });
        const galleryResult2 = await GalleryImage.updateMany({ status: "pending" }, { $set: { status: "verified" } });
        console.log(`Migrated gallery images to verified. Modified: ${galleryResult.modifiedCount + galleryResult2.modifiedCount}`);

        const contribResult = await PageContribution.updateMany({ status: { $exists: false } }, { $set: { status: "verified" } });
        const contribResult2 = await PageContribution.updateMany({ status: "pending" }, { $set: { status: "verified" } });
        console.log(`Migrated contributions to verified. Modified: ${contribResult.modifiedCount + contribResult2.modifiedCount}`);

        console.log("Migration complete.");
        process.exit(0);
    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    }
};

seedData();
