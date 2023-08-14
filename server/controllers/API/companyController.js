import Company from '../../models/Company.js';  // Adjust this import path accordingly
import CompanyComments from '../../models/CompanyComments.js';
import Chat from '../../models/Chat.js';

export const listCompaniesController = async (req, res) => {
    try {
        const { page = 1, search = '' } = req.query;  // Extract page and search query parameters

        const limit = 10;  // Or however many items you want per page
        const skip = (Number(page) - 1) * limit;  // Calculate the offset

        // Find events based on the search query, paginated
        const company = await Company.find({
            // Assuming you want to search by name of the event
            name: { $regex: new RegExp(search, 'i') }, 
        })
        .limit(limit)
        .skip(skip)
        .exec();

        res.status(200).json(company);

    } catch (error) {
        console.error("Error fetching events: ", error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export const getCompanyController = async (req, res) => {
    try {
        const { id } = req.query;  // Extract page and search query parameters


        // Find events based on the search query, paginated
        const company = await Company.findById(id)

        res.status(200).json(company);

    } catch (error) {
        console.error("Error fetching events: ", error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export const addCommentController = async (req, res) => {
    const { companyId, comment, comment_by } = req.body;

    try {
        const newComment = new CompanyComments({
            companyId,  // This is ES6 shorthand for: companyId: companyId
            comment,
            comment_by
        });

        await newComment.save();
        res.status(200).json({ message: 'Comment added successfully!', comment: newComment });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add the comment.' });
    }
};

export const getAllCommentsController = async (req, res) => {    
    try {        
        const companyId = req.params.companyId;        
        const comments = await CompanyComments.find({ companyId });
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getChatController = async (req, res) => {
    const companyId = req.params.companyId;
    const userId = req.params.userId;

    try {
        const chatMessages = await Chat.find({
            company: companyId,
            student: userId
        });

        res.json(chatMessages);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
