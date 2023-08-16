import User from '../../models/User.js';
import Resume from '../../models/Resume.js';

export const users = async (req, res) => {
    try {        
        res.render('Admin/users', { activeMenu: 'user', email: req.session.email });
    } catch (error) {
        console.error("Error loading users page:", error);
        res.status(500).send("Internal Server Error");
    }
};

export const getUnapprovedUsers = async (req, res) => {
    try {
        const unApprovedUsers = await User.find({ approved: false });
        
        const userResumes = await Promise.all(unApprovedUsers.map(async user => {
            const resume = await Resume.findOne({ user: user._id }).select("personalInfo skills");

            // If the resume doesn't exist for a user, return null so we can filter it out later.
            if (!resume) {
                return null;
            }
            
            return {
                ...user._doc,
                personalInfo: resume.personalInfo,
                skills: resume.skills
            };
        }));

        // Filter out null values
        const filteredUserResumes = userResumes.filter(user => user !== null);

        res.json(filteredUserResumes);
    } catch (error) {
        console.error("Error fetching unapproved users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getApprovedUsers = async (req, res) => {
    try {
        const approvedUsers = await User.find({ approved: true });
        
        const userResumes = await Promise.all(approvedUsers.map(async user => {
            const resume = await Resume.findOne({ user: user._id }).select("personalInfo skills");

            // If the resume doesn't exist for a user, return null so we can filter it out later.
            if (!resume) {
                return null;
            }
            
            return {
                ...user._doc,
                personalInfo: resume.personalInfo,
                skills: resume.skills
            };
        }));

        // Filter out null values
        const filteredUserResumes = userResumes.filter(user => user !== null);

        res.json(filteredUserResumes);
    } catch (error) {
        console.error("Error fetching approved users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const declineUser = async (req, res) => {
    try {
        // Assuming you're passing the user ID as a parameter in the URL
        const userId = req.params.id;

        // Delete the user from the database
        await User.findByIdAndDelete(userId);

        // Redirect or respond accordingly        
        res.status(200).json({
            message: "User declined and deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            error: "There was an error processing your request.",
            details: error.message
        });
    }
};

export const approveUser = async (req, res) => {
    console.log('approveUser',req.params.id);
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        user.approved = true;
        await user.save();

        res.send('User approved successfully');
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const searchUsers = async (req, res) => {
    try {
        const searchQuery = new RegExp(req.query.q, 'i');  // Create a case-insensitive regex
        const approved = req.query.approved === 'true';  // Convert string "true" or "false" to Boolean

        // Searching in Resume schema by name and skills
        const matchedResumes = await Resume.find({
            $or: [
                { "personalInfo.name": searchQuery },
                { "skills.name": searchQuery }
            ]
        });

        // Extracting user IDs from matched resumes
        const matchedUserIds = matchedResumes.map(resume => resume.user);

        // Searching in User schema by email and combining with matched user IDs from Resume, 
        // also considering the approved status
        const matchedUsers = await User.find({
            $and: [
                { approved: approved },  // Considering approved status
                {
                    $or: [
                        { email: searchQuery },
                        { _id: { $in: matchedUserIds } }
                    ]
                }
            ]
        });

        const userResumes = await Promise.all(matchedUsers.map(async user => {
            const resume = await Resume.findOne({ user: user._id }).select("personalInfo skills");

            if (!resume) {
                return null;
            }

            return {
                ...user._doc,
                personalInfo: resume.personalInfo,
                skills: resume.skills
            };
        }));

        res.json(userResumes.filter(user => user !== null));

    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// In your userController file

export const viewProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the resume and join with User to fetch the "approved" field
        const resume = await Resume.findOne({ user: userId }).populate('user');

        if (!resume) {
            return res.status(404).render('error', { message: "Resume not found" });
        }        
        res.render('Admin/userProfile', { resume , activeMenu: 'user', email: req.session.email, isCandidate: false });
    } catch (error) {
        console.error("Error fetching resume:", error);
        res.status(500).render('error', { message: "Internal Server Error" });
    }
};

