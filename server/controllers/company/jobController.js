import Job from '../../models/Job.js';
import JobApplication from '../../models/JobApplication.js';
import Resume from '../../models/Resume.js';


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
            companyId: req.session.companyId // Assuming the company ID is stored in the session
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
        const jobs = await Job.find({ companyId: req.session.companyId }).populate('companyId'); // If you want to display company details

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

function getMatchingPercentage(jobSkills, resumeSkills) {
    const candidateSkills = resumeSkills.map(skill => skill.name.trim().toLowerCase());
    
    // Split jobSkills if it's a comma-separated string
    const individualJobSkills = typeof jobSkills[0] === 'string' ? jobSkills[0].split(',').map(skill => skill.trim().toLowerCase()) : jobSkills;

    const matchingSkillsCount = individualJobSkills.filter(skill => candidateSkills.includes(skill)).length;

    return (matchingSkillsCount / individualJobSkills.length) * 100;
}


export const getCandidatesForJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Fetch the job details
        const job = await Job.findById(jobId);

        // Fetch the job applications for the specific job and populate the user details
        const jobApplications = await JobApplication.find({ jobId: jobId })
            .populate({
                path: 'userId',
                model: 'User',   
                select: 'email approved'
            });

        const candidates = await Promise.all(jobApplications.map(async application => {
            // For each application, find the associated resume
            const resume = await Resume.findOne({ user: application.userId._id });
            if (resume) {
                const matchingPercentage = getMatchingPercentage(job.skills, resume.skills);
                return {
                    applicationId: application._id, // This is the _id of the JobApplication model
                    applicationStatus: application.status,
                    userId: application.userId._id,
                    email: application.userId.email,
                    approved: application.userId.approved,
                    name: resume.personalInfo.name,
                    skills: resume.skills,
                    matchingPercentage: matchingPercentage
                };
            }
            return null;
        }));

        const filteredCandidates = candidates.filter(candidate => candidate !== null);        

        res.render('company/jobCandidates', { 
            candidates: filteredCandidates, 
            jobTitle: job.jobTitle,
            activeMenu: 'jobs',
            companyId: req.session.companyId,
            jobId: jobId
        });
        
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).send("Internal Server Error");
    }
};


export const viewCandidateProfile = async (req, res) => {
    try {
        const { userId, jobId, applicationId } = req.params;

        // Find the resume and join with User to fetch the "approved" field
        const resume = await Resume.findOne({ user: userId }).populate('user');
        const job = await Job.findById(jobId);
        const application = await JobApplication.findById(applicationId);

        if (!resume) {
            return res.status(404).render('error', { message: "Resume not found" });
        }        
        res.render('Company/candidateProfile', { 
            resume , 
            activeMenu: 'jobs', 
            companyId: req.session.companyId, 
            jobTitle: job.jobTitle,
            userId: userId, 
            isCandidate: true,
            applicationId: applicationId,
            appStatus: application.status 
        });        
    } catch (error) {
        console.error("Error fetching resume:", error);
        res.status(500).render('error', { message: "Internal Server Error" });
    }
};

export const updateApplicationStatus = async (req, res) => {    
    const { applicationId } = req.params;
    const { status } = req.body;
    console.log("applicationId",applicationId);
    console.log("status",status);

    try {
        const updatedApplication = await JobApplication.findByIdAndUpdate(applicationId, { status:status }, { new: true });        

        if (!updatedApplication) {
            return res.status(404).send('Application not found');
        }

        res.status(200).send({ message: 'Application status updated successfully' });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).send('Internal Server Error');
    }
};



