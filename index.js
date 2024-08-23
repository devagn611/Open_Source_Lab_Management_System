const express = require("express");
const path = require("path");
const app = express();
const db = require("./src/mongodb");
const LabUser = require("./src/model/LabUser");
const PatientUser = require("./src/model/PatientUser");
const ReportData = require("./src/model/ReportData");
const { Code } = require("mongodb");

const mongoose = require("mongoose");


// const fetch = require('node-fetch');
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

const templatePath = path.join(__dirname, "./templates");
const publicPath = path.join(__dirname, "./public");
console.log(publicPath);

app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.static(publicPath));

let isLogging = false; // Initialize as false when the application starts
let patientisLogging = false; // Initialize as false when the application starts

app.get("/report", (req, res) => {
  res.render("reports", { isLogging });
});

app.get("/report_list", (req, res) => {
  res.render("report_list", { isLogging });
});

app.post("/redirect", (req, res) => {
  const selectedReport = req.body.report;
  res.redirect(selectedReport);
});

app.get("/patient-login", (req, res) => {
  if (isLogging) {
    res.status(201).render("dashboard", { naming: req.body.name });
  } else {
    res.render("login-patient", { patientisLogging });
  }
});

app.get("/patient-register", (req, res) => {
  res.render("login-patient", { patientisLogging });
});

app.get("/login", (req, res) => {
  if (isLogging) {
    res.status(201).render("dashboard", { naming: req.body.name });
  } else {
    res.render("login", { isLogging });
  }
});

app.get("/register", (req, res) => {
  res.render("register", { isLogging });
});

app.get("/logout", (req, res) => {
  isLogging = false; // Log the user out
  patientisLogging = false; // Log the user out
  res.redirect("home"); // Redirect to the login page
});

// Middleware to check user authentication status
app.use((req, res, next) => {
  res.locals.isLogging = isLogging; // Set isLogging as a local variable
  res.locals.isLogging = patientisLogging; // Set isLogging as a local variable
  next();
});

app.get("/", (req, res) => {
  // console.log(isLogging);
  res.render("home", { isLogging, patientisLogging });
});

app.get("/home", (req, res) => {
  // console.log(isLogging);
  res.render("home");
});

app.get("/api/totalUsers", async (req, res) => {
  try {
    const totalUsers = await PatientUser.countDocuments({});
    res.json({ totalUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/patientData", async (req, res) => {
  try {
    // Fetch all patient users from the database
    const patients = await PatientUser.find({}).lean();

    // Transform the data if needed
    const formattedData = patients.map((patient) => ({
      name: patient.name,
      phoneNumber: patient.phoneNumber,
      email: patient.email,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      age: patient.age,
      allergies: patient.allergies,
      medication: patient.medication,
      role: patient.role,
    }));

    // Send the formatted data as JSON
    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching report data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/labData", async (req, res) => {
  try {
    // Fetch all lab users from the database
    const labData = await LabUser.find({}).lean();

    // Transform the data if needed
    const formattedData = labData.map((lab) => ({
      name: lab.name,
      phoneNumber: lab.phoneNumber,
      role: lab.role,
      // Note: email is not included in the schema, so it's removed here
    }));

    // Send the formatted data as JSON
    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching lab data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// lab login Code

app.post("/register", async (req, res) => {
  const data = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber, // Added phoneNumber field
    password: req.body.password,
  };
  const checking = await LabUser.findOne({ name: req.body.name });

  try {
    if (
      checking?.name === req.body.name &&
      checking?.password === req.body.password
    ) {
      res.send("User details already exist");
    } else if (checking?.name === req.body.name) {
      res.send("User details already exist");
    } else {
      await LabUser.create(data); // Use create() to insert a single document
      res.status(201).render("login", { isLogging });
    }
  } catch (err) {
    console.error(err);
    res.send("Wrong inputs");
  }
});

app.post("/login", async (req, res) => {
  try {
    const check = await LabUser.findOne({ name: req.body.name });

    if (check && check.password === req.body.password) {
      isLogging = true; // Set isLogging to true when the user successfully logs in
      req.user = check; // Set req.user with user data
      return res
        .status(201)
        .render("dashboard", { naming: req.body.name, isLogging: true });
    }

    return res.send("Incorrect password");
  } catch (e) {
    console.error(e);
    res.send("Wrong details");
  }
});

// patient login Code
app.post("/patient-register", async (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
  };

  try {
    // Log the received data
    console.log("Received registration data:", data);

    // Check if all required fields are present
    if (!data.name || !data.password || !data.phoneNumber || !data.email) {
      return res.status(400).send("All fields are required");
    }

    // Check if a user with the same name or phone number already exists
    const existingUser = await PatientUser.findOne({
      $or: [{ name: data.name }, { phoneNumber: data.phoneNumber }],
    });

    if (existingUser) {
      return res
        .status(400)
        .send("User with this name or phone number already exists");
    }

    // Create new user in MongoDB
    const newUser = await PatientUser.create(data);
    console.log("New user created:", newUser);

    // Set patientisLogging to true
    patientisLogging = true;

    // Redirect to dashboard-patient
    res.render("dashboard-patient");
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).send(`Error during registration: ${err.message}`);
  }
});

app.post("/patient-login", async (req, res) => {
  try {
    // Find the user by phone number
    const checking = await PatientUser.findOne({
      phoneNumber: req.body.phoneNumber,
    });

    if (checking) {
      // Check if the password matches
      if (checking.password === req.body.password) {
        patientisLogging = true; // Set the flag to indicate successful login
        return res.status(201).render("dashboard-patient", {
          name: checking.name,
          phoneNumber: checking.mobile,
          email: checking.email,
          gender: checking.gender,
          bloodGroup: checking.bloodGroup,
          age: checking.age, // Added phoneNumber field
          allergies: checking.allergies,
          medication: checking.medication,

          patientisLogging: true,
        });
      } else {
        return res.status(401).send("Incorrect password"); // Password mismatch
      }
    } else {
      return res.status(404).send("User with this phone number does not exist"); // User not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while logging in"); // Generic error handling
  }
});
app.post("/patient-report", async (req, res) => {
    patientisLogging=true;
    try {
        const data = {
            name: req.body.name,
            phoneNumber: req.body.mobile,
            email: req.body.email,
            gender: req.body.gender,
            bloodGroup: req.body.bloodGroup,
            age: req.body.age,
            allergies: req.body.allergies,
            medication: req.body.medication,
        };

        const checking = await ReportData.findOne({
            phoneNumber: req.body.mobile, // Use 'mobile' instead of 'phoneNumber'
        });

        if (checking?.phoneNumber === req.body.mobile) {
            res.status(409).send("User details already exist");
        } else {
            await ReportData.create(data); // Make sure 'patientisLogging' is defined
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error registering user");
    }
});


app.listen(port, () => {
  console.log("Port connected");
});

function isAuthenticated(req, res, next) {
  console.log(isLogging);
  if (isLogging) {
    next();
  } else {
    res.status(404).send("Page not found");
  }
}

app.use((req, res, next) => {
  res.locals.isLogging = isLogging;
  next();
});

app.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    const totalUsersResponse = await fetch(
      "http://localhost:3000/api/totalUsers"
    ); // Change the URL to the full URL including the port
    const totalUsersData = await totalUsersResponse.json();
    const totalUsers = totalUsersData.totalUsers;

    if (isLogging) {
      console.log(req.body.name);
      res.render("dashboard", {
        naming: req.body.name,
        totalUsers,
        isLogging: true,
      });
    } else {
      res.render("login", { isLogging });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Define a schema for your 'test_list' collection
const testSchema = new mongoose.Schema({
    test_name: String, // Adjust the data type according to your actual schema
  });
  
  // Create a model based on the schema
  const Test = mongoose.model('Test', testSchema);
  
  app.post('/api/test_list', async (req, res) => {
    try {
      // Fetch all documents from the 'test_list' collection
      const testData = await Test.find({}).lean();
  
      // Extract only the test names
      const formattedData = testData.map((test) => test.test_name);
  
      // Send the formatted data as JSON
      res.json(formattedData);
    } catch (error) {
      console.error("Error fetching test data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  