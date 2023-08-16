import Job from '../../models/Job.js';
import JobApplication from '../../models/JobApplication.js';
import Resume from '../../models/Resume.js';

export const fetchMatchingJobs = async (req, res) => {
    try {
        // Assuming the user is logged in and their ID is stored in req.session.userId or adjust accordingly
        const userId = req.query.user;

        // Retrieve the user's resume
        const userResume = await Resume.findOne({ user: userId });
        if (!userResume) {
            return res.status(404).json({ message: "User's resume not found!" });
        }

        // Extract user skills
        const userSkills = userResume.skills.map(skillObj => skillObj.name);

        // Set up the query for searching and pagination
        const regexPatterns = userSkills.map(skill => new RegExp(skill.trim(), 'i'));

        let query = { skills: { $in: regexPatterns } };

        if (req.query.search) {
            query.jobTitle = new RegExp(req.query.search, 'i');  // For case-insensitive search
        }

        // Handle Pagination
        const limit = 10;  // Number of jobs per page, adjust as necessary
        const skip = (parseInt(req.query.page) - 1) * limit;  // Calculate starting index

        // Fetch the matching jobs
        let matchingJobs = await Job.find(query).limit(limit).skip(skip);

        // Transform the skills attribute for each job from a string to an array
        matchingJobs = matchingJobs.map(job => {
            if (job.skills && job.skills[0]) {
                job.skills = job.skills[0].split(',').map(skill => skill.trim());
            }
            return job;
        });

        return res.status(200).json(matchingJobs);

    } catch (error) {
        console.error("Error fetching matching jobs: ", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const applyForJob = async (req, res) => {
    const { jobId, userId } = req.body;

    try {
        const application = new JobApplication({ jobId, userId, status: "Applied" });
        await application.save();
        
        return res.status(201).json(application);
    } catch (error) {
        console.error('Error while applying for job:', error);
        return res.status(200).json({
            jobId: jobId,
            userId: "",  
            status: "not applied"
        });
    }
};

export const getApplicationStatus = async (req, res) => {
    const { jobId, userId } = req.params;

    try {
        const application = await JobApplication.findOne({ jobId, userId });
        console.log(application)

        if (!application) {
            return res.status(200).json({
                jobId: jobId,
                userId: "",  
                status: "not applied"
            });
        }

        return res.status(200).json(application);
    } catch (error) {
        console.error('Error fetching application status:', error);
        return res.status(200).json({
            jobId: jobId,
            userId: "",  
            status: "not applied"
        });
    }
};

export const getAppliedJobs = async (req, res) => {
    const { userId } = req.params;

    try {
        const applications = await JobApplication.find({ userId })
            .populate('jobId');

        return res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching application status:', error);
        return res.status(500).json([]);
    }
};

