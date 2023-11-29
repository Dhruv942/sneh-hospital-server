var express = require("express");
const cors = require("cors");
require("./modals/connect");
const Patient = require("./modals/Patient");
const Admit = require("./modals/Admit");

var app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ status: "success" });
});

app.get("/getall", async function (req, res) {
    const data = await Patient.find().select();
    res.json(data);
});

app.post("/addpatient", async function (req, res) {
    const patient = new Patient({
        name: req.body.name,
        age: req.body.age,
        bloodgroup: req.body.bloodgroup,
        address: req.body.address,
        mobileNumber: req.body.mobileNumber
    });
    await patient.save();
    res.json({ status: "success" });
});

app.post("/admit_patient", async (req, res) => {
    const oldAdmit = await Admit.find({
        patientId: req.body.patientId,
        isDischarged: false
    });
    if (oldAdmit.length > 0) {
        res.json({ status: "failed", msg: "already admited" });
    } else {
        const admit = new Admit({
            patientId: req.body.patientId
        });
        let result = await admit.save();
        const patient = await Patient.findById(result.patientId);
        patient.admits.push(result._id);
        await patient.save();
        res.json({ status: "success", admit });
    }
});

app.post("/discharge_patient", async (req, res) => {
    const admit = await Admit.findById(req.body.admitId);
    if (admit && !admit.isDischarged) {
        admit.dischargeDate = Date.now();
        admit.isDischarged = true;
        await admit.save();
        res.json({ status: "success", admit });
    } else {
        res.json({
            status: "failed",
            msg: "admit patient not found or already discharged"
        });
    }
});

app.get("/get_admits", async (req, res) => {
    const data = await Admit.find({
        isDischarged: false
    }).sort({admitDate:-1})
        .populate("patientId")
        .exec();
    res.json(data);
});

app.post("/get_admit", async (req, res) => {
    const data = await Admit.findById(req.body.admitId)
    res.json({ status: "success", data });
});

app.post("/add_temperature", async (req, res) => {
    let admit = await Admit.findById(req.body.admitId);
    let date = req.body.date;
    let time = req.body.time;
    admit.temperatures.push({ date, time, temp: req.body.temp, urine: req.body.urine, vomiting: req.body.vomiting, heartrate: req.body.heartrate });
    await admit.save();
    res.json({ status: "success" });
});

app.post("/add_dr_sheet", async (req, res) => {
    let admit = await Admit.findById(req.body.admitId);
    let date = req.body.date;
    admit.drSheet.push({ date, note: req.body.note, treatment:req.body.treatment });
    await admit.save();
    res.json({ status: "success" });
});

app.post("/get_dr_sheet", async (req, res) => {
    let admit = await Admit.findById(req.body.admitId);
    res.json({ status: "success", data:admit.drSheet });
});

app.post("/add_drug_chart", async (req, res) => {
    let admit = await Admit.findById(req.body.admitId);
    let data = req.body
    delete data.admitId
    admit.drugChart.push(data);
    await admit.save();
    res.json({ status: "success" });
});

app.post("/get_drug_chart", async (req, res) => {
    let admit = await Admit.findById(req.body.admitId);
    res.json({ status: "success", data:admit.drugChart });
});

app.post("/get_temperature", async (req, res) => {
    let admit = await Admit.findById(req.body.admitId);
    res.json({ status: "success", temperatures: admit.temperatures });
});
app.post("/get_details", async (req, res) => {
    let admits = await Admit.find({patientId:req.body.patientId})
    res.json({ status: "success", admits });
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
