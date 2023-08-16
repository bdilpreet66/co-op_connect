import Company from "../../models/Company.js";

export const companyListController = async (req, res) => {
    try {
        let searchQuery = req.query.search || '';
        let companies = await Company.find({ name: new RegExp(searchQuery, 'i') });

        res.render('Admin/companyList', { companies, activeMenu: 'company', email: req.session.email });
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).send("Internal Server Error");
    }
};

export const companyViewController = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        
        if (!company) {
            return res.status(404).send('Company not found');
        }
        res.render('Admin/companyView', { company, activeMenu: 'company', email: req.session.email });
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).send("Internal Server Error");
    }
};
