import Job from '../../models/Job.js';
import JobApplication from '../../models/JobApplication.js';
import CandidateProfile from '../../models/CandidateProfile.js';


export const getAddJob = (req, res) => {
    res.render('company/addJob',{activeMenu:'jobs',companyId: req.session.companyId});   
};

export const postAddJob = async (req, res) => {
    console.log("req.body",req.body);
    //return;
    try {
        let { jobTitle, compensationType, rateType, hourlyRate, annualRate, workSetup, jobLocation, jobDescription, skills } = req.body;
        if (isNaN(hourlyRate)) hourlyRate = 0;
        if (isNaN(annualRate)) annualRate = 0;
        if (!rateType) rateType = 'na';
        const newJob = new Job({
            jobTitle,
            compensationType,
            rateType,
            hourlyRate,
            annualRate,
            workSetup,
            jobLocation,
            jobDescription,
            skills: skills.split(',').map(skill => skill.trim()), // Assuming skills are comma-separated
            //company: req.user.companyId // Assuming the company ID is stored in the session
        });
        await newJob.save();
        res.redirect('/company/jobs'); // Redirect to a jobs listing page or wherever you prefer
    } catch (error) {
        console.error("Error adding job:", error);
        res.status(500).send("Internal Server Error");
    }
};

export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('company'); // If you want to display company details

        // Fetch the count of candidates for each job
        const jobsWithCounts = await Promise.all(jobs.map(async job => {
            const count = await JobApplication.countDocuments({ jobId: job._id });
            return {
                ...job._doc,  // Spread the job document
                candidateCount: count  // Add the count of candidates
            };
        }));

        res.render('company/jobsList', { jobs: jobsWithCounts, activeMenu: 'jobs',companyId: req.session.companyId });        
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).send("Internal Server Error");
    }
};


export const getEditJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).send('Job not found');
        }
        res.render('company/editJob', { job:job, activeMenu:'jobs',companyId: req.session.companyId });
    } catch (error) {
        console.error("Error fetching job:", error);
        res.status(500).send("Internal Server Error");
    }
};

export const postEditJob = async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.redirect('/company/jobs');  // Redirect to the jobs list or wherever you prefer
    } catch (error) {
        console.error("Error updating job:", error);
        res.status(500).send("Internal Server Error");
    }
};
export const getCandidatesForJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;  // Assuming you're passing the jobId in the URL

        // Fetch the job details
        const job = await Job.findById(jobId);  // Assuming you have a Job model

        // Fetch the job applications for the specific job and populate the candidate details
        const jobApplications = await JobApplication.find({ jobId: jobId })
            .populate({
                path: 'candidateId',
                model: 'CandidateProfile',
                select: 'firstName lastName jobTitle school course skills' // Select the desired fields
            });

        // Extract the candidate details
        const candidates = jobApplications.map(application => {
            const profile = application.candidateId;
            return {
                firstName: profile.firstName,
                lastName: profile.lastName,
                jobTitle: profile.jobTitle,
                school: profile.school,
                course: profile.course,
                skills: profile.skills
            };
        });

        res.render('company/jobCandidates', { 
            candidates, 
            jobTitle: job.jobTitle,  // Pass the job name to the view
            activeMenu: 'jobs',
            companyId: req.session.companyId
        }); 
        
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).send("Internal Server Error");
    }
};



