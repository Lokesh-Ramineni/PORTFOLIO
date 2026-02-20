require("dotenv").config();
const express = require('express');
const { link } = require("fs");
const path=require('path');
const app=express();
const port = 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
require("./nodemailer")(app);

app.use(express.static('public'));

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine","ejs");

app.get("/",(req,res) =>{
    res.render("home");
})
app.get("/projects",(req,res) =>{
    res.render("projects");
}
);
app.get("/skills",(req,res) => {
    res.render("skills");
})
app.get("/about",(req,res) => {
    res.render("about");
});
app.get("/contact",(req,res) => {
    res.render("contact");
});

technical_skills=[
    [
        {name:"HTML",img_src:"https://cdn-icons-png.flaticon.com/512/732/732212.png"},
        {name:"CSS",img_src:"https://cdn-icons-png.flaticon.com/512/732/732190.png"},
        {name:"JavaScript",img_src:"https://cdn-icons-png.flaticon.com/512/5968/5968292.png"},
    ],
    [
        {name:"Node.js",img_src:"https://cdn-icons-png.flaticon.com/512/919/919825.png"},
        {name:"Express.js",img_src:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg"},
        {name:"EJS",img_src:"ejs.svg"},

    ],
    [
        {name:"MongoDB",img_src:"mongo1.png"},   
        {name:"MySQL",img_src:"mysql.png"},
    ],
    [
        {name:"Git",img_src:"git.png"},
        {name:"GitHub",img_src:"github.png"},
    ]
]
headings = ["Frontend Technologies", "Backend Technologies","Databases","Version Control"];

projects = [
    {
        type:"WEB Application",title:"Lost and Found Portal (Ongoing)",description:"A web application to help users report lost items and find found items.",tech_stack:["HTML","CSS","JavaScript","Node.js","Express.js","MongoDB"],livelink:""
    },
    {
        type:"WEB Application",title:"Portfolio Website",description:"A responsive portfolio website showcasing projects, skills, and contact information.",tech_stack:["HTML","CSS","JavaScript","Node.js","Express.js","EJS"] ,livelink:"https://lokesh-ramineni.vercel.app/"
    },
    {
        type:"WEB Application",title:"Gade Calculator",description:"A desktop application for performing grade calculations.",tech_stack:["HTML","CSS","JavaScript"],livelink:"https://student-gradecalc.vercel.app/"
    }
]
education=[
    {
        year:"2024 - 2029", location:"Andhra Pradesh",title:"Integrated M.Tech in Computer Science and Engineering",institute:"Vellore Institute of Technology, Amaravati",description:"Currently pursuing a Bachelor of Technology in Computer Science, with coursework in data structures, algorithms, databases, and web development. Actively building projects and strengthening problem-solving skills.\n CGPA: 8.86/10"
    },
    {
        year:"2022-2024",location:"Andhra Pradesh",title:"Higher Secondary Education",institute:"Narayana Junior College, Nellore",description:"Completed Class XII (2022 - 2024) at Narayana Junior College with core subjects in Mathematics, Physics, and Chemistry. Achieved strong academic results and developed a solid foundation.\nPercentage:94.4%"
    },{
        year:"2021 - 2022",location:"Andhra Pradesh",title:"Secondary School Education",institute:"Narayana Techno School, Nellore",description:"Completed Class X (2021 - 2022) at Narayana Techno School with a focus on Science and Mathematics.\nPercentage: 96%"
    }
]

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});