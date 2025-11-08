export const createAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const newAdmin = new Admin({ email, password });
        await newAdmin.save();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
    res.status(201).json({ message: "Admin created successfully" });
}
export const deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        await Admin.findByIdAndDelete(adminId);
        res.status(200).json({ message: "Admin deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
export const getAdminStatus = async (req, res) => {
    try {
        const adminId = req.params.id;
        const admin = await Admin.findById(adminId);    
        if (!admin) return res.status(404).json({ message: "Admin not found" });
        res.status(200).json({ isActive: admin.isActive });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}