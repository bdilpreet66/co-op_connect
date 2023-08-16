
import Job from '../../models/Job.js';
import Event from '../../models/Event.js';
import JobApplication from '../../models/JobApplication.js'; // Assuming this is the model where you track job applications

export const companyDasboardController = async (req, res) => {
    if (req.session.userId) {
        console.log(`Welcome ${req.session.userId}`);
        console.log(`Welcome Company ${req.session.companyId}`);
      } else {
        console.log('Please log in first.');
      }

    try {
        const openJobs = await Job.find({ status: 'open', companyId: req.session.companyId }); // Assuming 'status' field determines if a job is open
        
        // Fetch events where the end date is greater than the current date
        const currentDate = new Date();
        const openEvents = await Event.find({ end: { $gt: currentDate }, companyId: req.session.companyId });

        // Fetch the number of candidates who applied to each job
        const jobWithCandidateCounts = await Promise.all(openJobs.map(async job => {
            const count = await JobApplication.countDocuments({ jobId: job._id });
            return {
                ...job._doc, // Spread the job document
                candidateCount: count // Add the candidate count
            };
        }));

        res.render('Company/dashboard', { openJobs: jobWithCandidateCounts, openEvents, activeMenu: 'dashboard', companyId: req.session.companyId });
    } catch (error) {
        console.error("Error fetching data for company dashboard:", error);
        res.status(500).send("Internal Server Error");
    }
};
