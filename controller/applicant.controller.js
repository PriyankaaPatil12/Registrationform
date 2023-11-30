import ApplicantModel from "../model/Applicant.model";
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads";

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const name = file.originalname;
    const ext = path.extname(name);
    const nameArr = name.split(".");
    nameArr.pop();
    const fname = nameArr.join(".");
    const fullname = fname + "-" + Date.now() + ext;
    cb(null, fullname);
  },
});
const upload = multer({ storage: storage });

export const getallApplicants = async (req, res) => {
  try {
    const Data = await ApplicantModel.find();
    if (Data) {
      return res.status(200).json({
        data: Data,
        message: "success",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const AddApplicants = (req, res) => {
  try {
    const uploadapplicantdata = upload.single("resume");

    uploadapplicantdata(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const { name, dob, gender, hobbies, state, address } = req.body;

      let DateOfBirth = null;
      if (dob) {
        const inputDate = new Date(dob);
        DateOfBirth = new Date(
          inputDate.getFullYear(),
          inputDate.getMonth(),
          inputDate.getDate()
        );
      }
      
      let resume = null;
      if (req.file !== undefined) {
        resume = req.file.filename;
      }

      const createdRecord = new ApplicantModel({
        name: name,
        dob: DateOfBirth,
        gender: gender,
        hobbies: hobbies,
        state: state,
        address: address,
        resume: resume,
      });

      createdRecord.save();
      if (createdRecord) {
        return res.status(201).json({
          data: createdRecord,
          message: "Success",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
