const agency = require("../Model/AgencyModel");
const employees = require("../Model/EmployeeModel");
const { sendSMS } = require("../Twilio/Twili");
const users = require("../Model/UserModel");
const Jobs = require("../Model/JobModel");


const AgencyRegister = async (req, res) => {
  console.log(req.body);

  try {
    const { username, email, password } = req.body;

    const Agency = new agency({
      username: username,
      email: email,
      password: password,
    });
    await Agency.save();

    res.status(200).json({
      status: "success",
      message: "agency registered successfully",
    });
  } catch (error) {
    res.status(405).json({
      status: "failed to register",
      message: error.message,
    });
  }
};
const agencyLogin = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    // Get the agency account from the database.
    const Agency = await agency.findOne({ email: email });

    // If the agency account does not exist,
    if (!Agency) {
      return res.status(404).json({
        status: "failed",
        message: "Agency account does not exist.",
      });
    }

    // If the password is incorrect,
    if (password !== Agency.password) {
      return res.status(401).json({
        status: "failed",
        message: "Password incorrect.",
      });
    }

    // If the agency account is valid,
    return res.status(200).json({
      status: "success",
      message: "Agency signed in successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "internal server error",
      message: error.message,
    });
  }
};

const UnapprovedEmployees = async (req, res) => {
  try {
    const AllunApprovedEmployees = await employees.find({ isApproved: false });

    if (AllunApprovedEmployees.length > 0) {
      res.status(200).json({
        status: "success",
        Data: AllunApprovedEmployees,
      });
    } else {
      res.status(205).json({
        status: "success",
        message: "no new request",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "internal server error",
      message: error.message,
    });
  }
};

const UnApprovedEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const Employee = await employees.findOne({ _id: id });

    if (Employee) {
      return res.status(200).json({
        status: "success",
        Data: Employee,
      });
    } else {
      return res.status(205).json({
        status: "success",
        message: "no employee found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "internal server error",
      message: error.message,
    });
  }
};

const DeleteAunapprovedEmployee = async (req, res) => {
  console.log("this is from deletelemployee ");
  try {
    const { id } = req.params;
    console.log(id);
    const Employee = await employees.findByIdAndDelete({ _id: id });

    console.log("this is from try block");

    console.log(Employee, "employeeeee requestigsrhighsdi");

    if (Employee) {
      return res.status(200).json({
        status: "success",
        message: "employee deleted successfully",
      });
    } else {
      return res.status(205).json({
        status: "failure",
        message: "no employee found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "internal server error",
      message: error.message,
    });
  }
};

const approveEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const employee = await employees.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!employee) {
      return res.status(405).json({ message: "Employee not found" });
    }

    // Check if isApproved is true, and if so, send an SMS
    if (employee.isApproved) {
      // const number=`+91${employee.phonenumber}`
      // const number="+918921358370"
      const number = "+91" + employee.phonenumber;
      const id = employee._id;
      console.log(number);
      const message = `Dear ${employee.name}......Your employee account has been approved.Your Licence no is ${id} Welcome to EmployEase!`;
      await sendSMS(number, message);
    }

    res.status(200).json({ message: "Employee approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getGetAllapprovedEmployees = async (req, res) => {
  try {
    const PAGE_SIZE = 6;
    const page = parseInt(req.query.page) || 0;
    const total = await employees.countDocuments({});
    const approvedEmployees = await employees
      .find({ isApproved: true })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);

    if (approvedEmployees.length > 0) {
      return res.status(200).json({
        message: "successfull",
        Data: approvedEmployees,
        totalPages: Math.ceil(total / PAGE_SIZE),
      });
    } else {
      return res.status(205).json({
        message: "failed to fetch approved employees",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "internal server error",
      message: error.message,
    });
  }
};

const GetAllUsers = async (req, res) => {
  try {
    const Allusers = await users.find();
    res.status(200).json({
      status: "success",
      Data: Allusers,
    });
  } catch (error) {
    console.log(error);
  }
};

const GetAllUnapprovedJobs = async (req, res) => {
  try {
    const PAGE_SIZE = 3;
    const page = parseInt(req.query.page) || 0;
    const total = await Jobs.countDocuments({});

    const jobs = await Jobs.find({ isApproved: false })
      .populate("userId")
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);

    if (jobs.length > 0) {
      return res.status(200).json({
        message: "success",
        Data: jobs,
        totalPages: Math.ceil(total / PAGE_SIZE),
      });
    } else {
      return res.status(201).json({
        message: "no new job request found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const GetJobbyId = async (req, res) => {
  try {
    const id  = req.params.id;
    console.log(id);
    const Jobdetails = await Jobs.findOne({ _id: id }).populate("userId");

    res.status(200).json({
      message: "success",
      Data: Jobdetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed",
      Data: error,
    });
  }
};

const GetSimilerEmployees=async(req,res)=>{
    const {id} =req.params

    console.log("*********id***********", typeof id);

    try {

        console.log("shuaib");
        const Jobdetails=await Jobs.findById(id)
        console.log("****jobdetails********",Jobdetails);
         
        const category=Jobdetails.category

        const SimilerEmployees=await employees.find({category:category})

        // if(!Jobdetails){

        //     console.log("no job details");
        // }
        // else {
        //     res.json({Jobdetails,
        //     category:Jobdetails.category});
        // }

        if(SimilerEmployees.length>0){
          return  res.status(200).json({
                data:SimilerEmployees
            })
        }else{
            return res.status(203).json({
                message:"no employee found"
            })
        }

    } catch (error) {
        res.status(500).json({
            message:"failed",
            error:error
        })
    }
}

const SendJobMessageToEmployees = async (req, res) => {
  try {
    const { data, id } = req.body;

    console.log(data,id,"*****fu****");


    for (const employeeId of data) {
      // Find the employee by their ID and push the job ID into their newRequest array
      await employees.findByIdAndUpdate(
        employeeId,
        { $push: { newRequest: id } },
        { new: true }
      );
    }

    return res.status(200).json({ message: 'Job requests sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// ***************************************chat gpt logic verify the code   *****************************
const AgencyApproveJob=async(req,res)=>{
  const jobId=req.params.id
  try {

    console.log("agency approve is working");
    // Find the job by its ID
    const job = await Jobs.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if(job.scheduledemployees.length <job.numberofemployees){
      return res.status(203).json({
        message:"employees are not scheduled"
      })
    }
    // Update isApproved to true
    job.isApproved = true;

    // Modify the scheduledemployees array length
    const numberOfEmployees = job.numberofemployees;
    if (job.scheduledemployees.length >=numberOfEmployees) {
      job.scheduledemployees = job.scheduledemployees.slice(0, numberOfEmployees);
    }
      

    console.log("------scheduledemployees array after slice-------", job.scheduledemployees);

    // updating employee status ti isAcive true

    for (const employeeId of job.scheduledemployees) {
      const employee = await employees.findById(employeeId);
      if (employee) {
        employee.isActive = true;
        // Push the jobId to the approvedRequest array of the employee
        employee.approvedRequest.push(jobId);
        await employee.save();
      }
    }
    

    // Find all jobs with isApproved false
    const jobsToUpdate = await Jobs.find({ _id: { $ne: jobId }, isApproved: false });

// const result = b.filter(element => !a.includes(element));
// Create a set of employee IDs from the approved job
// Iterate through jobsToUpdate to remove matching employee IDs from scheduledemployees
for (const jobToUpdate of jobsToUpdate) {
  jobToUpdate.scheduledemployees = jobToUpdate.scheduledemployees.filter((employeeId) =>
    !job.scheduledemployees.includes(employeeId)
  );
  console.log("eliminatined pure array",jobToUpdate);
  // Save the updated job
  await jobToUpdate.save();
}

    // Save the updated job
    await job.save();

    return res.status(200).json({ message: 'Job approved successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const AgencydeleteJob=async(req,res)=>{
  const id=req.params.id
  console.log(id);
  try {
    const job=await Jobs.findByIdAndDelete(id)
    if(!job){
      return res.status(404).json({
        message:"no job found"
      })
    }

    res.status(200).json({
      message:"job deleted successfully"
    })
  } catch (error) {

    res.status(500).json({
      message:"error",
      data:error,
    })
    
  }
}


const  GetApprovedAlljobs=async(req,res)=>{
  try {
    const jobs= await Jobs.find({isApproved:true}).populate("scheduledemployees")

    if(jobs.length>0){
      return res.status(200).json({
        message:"success",
        Data:jobs
      })
    }else{
      res.status(203).json({
        message:"No New Approved Jobs"
      })
    }


  } catch (error) {
    res.status(500).json({
      message:"something went wrong",
      error:error
    })
  }
}




const GetAllCompletedRequests=async(req,res)=>{
  try {
    const ApprovedJobs=await Jobs.find({isCompleted:true}).populate("scheduledemployees")

    if(AgencyApproveJob.length>0){
      return res.status(200).json({
        message:"sucees",
        Data:ApprovedJobs
      })
    }
  } catch (error) {
    res.status(500).json({
      message:"error",
      Data:error
    })
  }
}


// *******************end of todo to verify ****************************
module.exports = {
  AgencyRegister,
  agencyLogin,
  UnapprovedEmployees,
  UnApprovedEmployee,
  DeleteAunapprovedEmployee,
  approveEmployeeById,
  getGetAllapprovedEmployees,
  GetAllUsers,
  GetAllUnapprovedJobs,
  GetJobbyId,
  GetSimilerEmployees,
  SendJobMessageToEmployees,
  AgencyApproveJob,
  AgencydeleteJob,
  GetApprovedAlljobs,
  GetAllCompletedRequests


};
