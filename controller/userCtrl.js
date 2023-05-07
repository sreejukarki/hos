const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModels");
 const appointmentModel = require("../models/appointmentModel")
 const moment = require('moment')

const JWT_SECRET = "SIRJUisagoodgirl"

//register callback
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User Al ready Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};
const loginController=async(req,res)=>{
    try {


        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
          return res
            .status(200)
            .send({ message: "user not found", success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
          return res
            .status(200)
            .send({ message: "Invalid EMail or Password", success: false });
        }
        const token = jwt.sign({ id: user._id },JWT_SECRET ,{
          expiresIn: "1d",
        });
        res.status(200).send({ message: "Login Success", success: true, token });
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
      }

}
const authController = async (req,res) =>{
    try {
        const user = await userModel.findOne({_id:req.body.userId})
        user.password = undefined
        if(!user){
            return res.status(200).send({
                message:'user not found',
                success:false
            })
         } else {
            res.status(200).send({
                success:true,
                data:user
            });
            }
        } catch(error) {
          console.log(error)
            res.status(500).send({
                
                message: 'auth error',
                success: false,
                error
              });
        
        }
    }
    // APpply DOctor CTRL
    const  applyDoctorController =async (req, res)=>{

try {
  const newDoctor = await doctorModel({ ...req.body, status: "pending" });
  await newDoctor.save();
  const adminUser = await userModel.findOne({ isAdmin: true });
  const notifcation = adminUser.notifcation;
  notifcation.push({
    type: "apply-doctor-request",
    message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
    data: {
      doctorId: newDoctor._id,
      name: newDoctor.firstName + " " + newDoctor.lastName,
      onClickPath: "/admin/doctor",
    },
  }); 
  await userModel.findByIdAndUpdate(adminUser._id, { notifcation })
  res.status(201).send({
    success: true,
    message: "Doctor Account Applied SUccessfully",
  });
} catch (error) {
  console.log(error);
  res.status(500).send({
    success: false,
    error,
    message: "Error WHile Applying For Doctotr",
  })
  }
}

//notification ctrl
const getAllNotificationController = async (req,res) =>{
  try {
    const user = await userModel.findOne({_id: req.body.userId})
    const seennotification = user.seennotification;
    const notifcation = user.notifcation;
    seennotification.push(...notifcation);
    user.notifcation = [];
    user.seennotification = notifcation;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }

}
//GET ALL DOC
const getAllDoctorsController = async (req, res) =>{
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Docots Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Errro WHile Fetching DOcotr",
    });
  }
};
  //BOOK APPOINTMENT
const bookeAppointmnetController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ user_Id: req.body.doctorInfo.userId });
    user.notifcation.push({
      type: "New-appointment-request",
      message: `A nEw Appointment Request from ${req.body.userInfo.name}`,
      onCLickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Book succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
};
const userAppointmentsController = async (req, res) =>{
try {
  const appointments = await appointmentModel.find({
    userId : req.body.userId,
  });
  res.status(200).send({
    success: true,
    message: "Users Appointments Fetch SUccessfully",
    data: appointments,
  });
  
} catch (error) {
  console.log(error);
  res.status(500).send({
    success: false,
    error,
    message: "Error In User Appointments",
  });
}
}

module.exports = { loginController, registerController,authController,applyDoctorController, getAllNotificationController, getAllDoctorsController,bookeAppointmnetController, userAppointmentsController};