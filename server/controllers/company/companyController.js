import Company from '../../models/Company.js';

export const listCompaniesController = async (req, res) => {
    try {
        const companies = await Company.find();
        res.render('listCompanies', { companies: companies, activeMenu: 'companies',companyId: req.session.companyId });
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).send("Internal Server Error");
    }
};


export const getEditCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).send("Company not found");
        }
        res.render('company/editCompany', { company: company, activeMenu: 'profile',companyId: req.session.companyId });
    } catch (error) {
        console.error("Error fetching company:", error);
        res.status(500).send("Internal Server Error");
    }
};

export const postEditCompany = async (req, res) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.render('company/editCompany', { company: updatedCompany, activeMenu: 'profile', companyId: req.session.companyId, successMessage: "Company profile updated successfully!" });
    } catch (error) {
        console.error("Error updating company:", error);
        res.status(500).send("Internal Server Error");
    }
};

