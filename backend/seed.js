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

        // 1. Seed 10 bilingual questions
        await QuizQuestion.deleteMany({});
        const questions = [
            {
                question: "What is the primary language spoken in Mali Tibba? / माली टिब्बा में मुख्य रूप से कौन सी भाषा बोली जाती है?",
                options: ["Hindi / हिंदी", "Garhwali / गढ़वाली", "Kumaoni / कुमाउनी", "English / अंग्रेज़ी"],
                correctAnswer: "Garhwali / गढ़वाली"
            },
            {
                question: "Which major mountain range is closest to Mali Tibba? / माली टिब्बा के सबसे करीब कौन सी प्रमुख पर्वत श्रृंखला है?",
                options: ["Himalayas / हिमालय", "Aravalli / अरावली", "Vindhya / विंध्य", "Satpura / सतपुड़ा"],
                correctAnswer: "Himalayas / हिमालय"
            },
            {
                question: "What is the most famous temple in Mali Tibba? / माली टिब्बा का सबसे प्रसिद्ध मंदिर कौन सा है?",
                options: ["Kedarnath / केदारनाथ", "Badrinath / बद्रीनाथ", "Mali Tibba Mahadev / माली टिब्बा महादेव", "Tungnath / तुंगनाथ"],
                correctAnswer: "Mali Tibba Mahadev / माली टिब्बा महादेव"
            },
            {
                question: "Which of the following is a traditional dish of the region? / निम्नलिखित में से कौन सा इस क्षेत्र का पारंपरिक व्यंजन है?",
                options: ["Dosa / डोसा", "Chainsoo / चैंसूं", "Dhokla / ढोकला", "Biryani / बिरयानी"],
                correctAnswer: "Chainsoo / चैंसूं"
            },
            {
                question: "What is the main occupation of people in Mali Tibba? / माली टिब्बा में लोगों का मुख्य व्यवसाय क्या है?",
                options: ["Fishing / मछली पकड़ना", "Agriculture / कृषि", "Mining / खनन", "IT / आईटी"],
                correctAnswer: "Agriculture / कृषि"
            },
            {
                question: "Which festival is celebrated with maximum fervor here? / यहाँ कौन सा त्योहार सबसे अधिक उत्साह के साथ मनाया जाता है?",
                options: ["Diwali / दिवाली", "Makar Sankranti / मकर संक्रांति", "Harela / हरेला", "Pongal / पोंगल"],
                correctAnswer: "Harela / हरेला"
            },
            {
                question: "What is the local folk dance called? / स्थानीय लोक नृत्य को क्या कहा जाता है?",
                options: ["Bhangra / भांगड़ा", "Chholiya / छोलिया", "Garba / गरबा", "Kathak / कथक"],
                correctAnswer: "Chholiya / छोलिया"
            },
            {
                question: "Which river flows near Mali Tibba? / माली टिब्बा के पास कौन सी नदी बहती है?",
                options: ["Ganga / गंगा", "Yamuna / यमुना", "Alaknanda / अलकनंदा", "Kaveri / कावेरी"],
                correctAnswer: "Alaknanda / अलकनंदा"
            },
            {
                question: "What type of climate is generally experienced in Mali Tibba? / माली टिब्बा में आमतौर पर किस प्रकार की जलवायु होती है?",
                options: ["Tropical / उष्णकटिबंधीय", "Desert / रेगिस्तानी", "Temperate/Cold / समशीतोष्ण/ठंडा", "Equatorial / भूमध्यरेखीय"],
                correctAnswer: "Temperate/Cold / समशीतोष्ण/ठंडा"
            },
            {
                question: "Which tree is most commonly found in the forests of Mali Tibba? / माली टिब्बा के जंगलों में सबसे अधिक पाया जाने वाला पेड़ कौन सा है?",
                options: ["Coconut / नारियल", "Pine (Chir) / चीड़ (पाइन)", "Banyan / बरगद", "Mango / आम"],
                correctAnswer: "Pine (Chir) / चीड़ (पाइन)"
            }
        ];
        await QuizQuestion.insertMany(questions);
        console.log("Seeded 10 bilingual questions successfully.");

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
