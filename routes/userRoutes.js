const express = require("express");
//const { loginController } = require("../controllers/userCTRL.JS");
//const { registerController } = require("../controllers/userCTRL.JS");
const authMiddleware = require("../middlewares/authMiddleware");
//const { authController } = require("../controllers/userCTRL.JS");
const { registerController, loginController, authController,applyDoctorController, getAllNotificationController, bookeAppointmnetController, userAppointmentsController} = require("../controller/userCtrl");
const { getAllDoctorsController } = require("../controller/adminCtrl");
//const { getAllDoctorsController } = require("../controller/adminCtrl");
 //const { applyDoctorController } = require("../controllers/userCTRL.JS"); 

//router onject
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);
module.exports = router;

//AUTH || POST
router.post("/getUserData", authMiddleware , authController);

//APply Doctor || POST
{/*router.post("/apply-doctor", authMiddleware, applyDoctorController);*/}
router.post("/apply-doctor",authMiddleware ,applyDoctorController )
//Notifiocation Doctor || Post
router.post("/get-all-notification",authMiddleware ,getAllNotificationController )


router.get('/getAllDoctors', authMiddleware,getAllDoctorsController )
//BOOK APPOINTMENT
router.post("/book-appointment", authMiddleware, bookeAppointmnetController);
//Appointments List
router.get("/user-appointments", authMiddleware, userAppointmentsController);

module.exports = router; 
