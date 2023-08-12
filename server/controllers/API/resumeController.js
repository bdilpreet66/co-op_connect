import Resume from '../../models/Resume.js';
import User from '../../models/User.js';

export const createResume = async (req, res) => {
    try {
        console.log(req.body)
        const data = req.body
        if (data._id != "-1") {
            const resume = await Resume.findByIdAndUpdate(data._id, {user: data.userId, personalInfo: data.personalInfo, educationExperiences: data.educationExperiences, skills: data.skills});
            res.status(201).send(resume);
        } else {
            const resume = new Resume({user: data.userId, personalInfo: data.personalInfo, educationExperiences: data.educationExperiences, skills: data.skills});
            await resume.save();
            res.status(201).send(resume);
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
};

export const getResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ user: req.params.id });

        if (!resume) {
            const user = await User.findById(req.params.id);

            // Return an empty structure of the resume
            return res.json({
                _id: "-1",
                userId: user._id,
                personalInfo: {
                    name: user.name || "",  // If user has name field
                    email: user.email || "",
                },
                educationExperiences: [],
                skills: []
            });
        }

        res.send(resume);
    } catch (error) {
        res.status(500).send(error);
    }
};


