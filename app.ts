/* --------------------------------- Imports -------------------------------- */
import express from 'express';
import { Request, Response } from 'express';
import pgImport from 'pg';
const { Client } = pgImport;
import 'dotenv/config';
import path from 'path';
import pc from "picocolors";
import livereload from "livereload";
import connectLiveReload from "connect-livereload";

/* --------------------------- App Initialization --------------------------- */
const app = express();

/* --------------------------- Live Reload Server --------------------------- */
const liveReloadServer = livereload.createServer();

liveReloadServer.watch(path.resolve('views'));
liveReloadServer.watch(path.resolve('public'));

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
app.use(connectLiveReload());

/* ------------------- View Engine and Database Connection ------------------ */
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
});

connectToDatabase();

/* --------------------------------- Routing -------------------------------- */
app.get("/", async (req, res) => {
  try {
    const result = await client.query(
      'SELECT * FROM courses'
    );
    res.render('index', { courses: result.rows });
  } catch (error) {
    console.log(error);
  }
});

app.get("/form", async (req, res) => {
  const isSaved = req.query.saved === 'true';
  res.render('form', { 
    warningArray: [],
    courseData: {},
    showSaved: isSaved 
  });
});

app.get("/about", async (req, res) => {
  res.render('about');
});

/* ---------------------------------- Posts --------------------------------- */
app.post('/form', async (req, res) => {
  formSubmit(req, res);
});

app.post('/delete', async (req, res) => {
  const courseToDelete = req.body.coursecode;

  if (!courseToDelete) {
    return res.redirect("/");
  }

  try {
    const query = 'DELETE FROM courses WHERE coursecode = $1';
    await client.query(query, [courseToDelete]);

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/?error=true");
  }
});

/* ----------------------- Application Start Sequence ----------------------- */
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  setTimeout(() => {
    console.log("\n-------------------------------------------");
    console.log(`  ● Server is running!`);
    console.log(`  › ${pc.blue(pc.underline(`http://localhost:${PORT}`))}`);
    console.log("-------------------------------------------");
  }, 500);
});

/* ------------------------------- Interfaces ------------------------------- */
interface Course {
  courseCode: string;
  courseName: string;
  syllabus: string;
  progression: string;
}

/* -------------------------------- Functions ------------------------------- */
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('  ✔ Connected to database!');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Connection error: ' + error.message);
    }
  }
}

function validateInput(input: string, message: string, array: Array<string>) {
  if(input === "") {
    array.push(message);    
  }
}

async function formSubmit(req: Request, res: Response) {
  let warningArray: Array<string> = [];

  const courseData: Course = {
    courseCode: req.body.coursecode || "",
    courseName: req.body.coursename || "",
    syllabus: req.body.syllabus || "",
    progression: req.body.progression || ""
  }

  validateInput(courseData.courseCode, 'Kurskod kan inte vara tomt.', warningArray);
  validateInput(courseData.courseName, 'Kursnamn kan inte vara tomt.', warningArray);
  validateInput(courseData.syllabus, 'Kursplan kan inte vara tomt.', warningArray);

  const isLink = courseData.syllabus.slice(0, 4);
  if (isLink !== "http" && isLink.length > 0) {
    warningArray.push('Kursplanen är inte en länk');
  }

  validateInput(courseData.progression, 'Kursprogression kan inte vara tomt.', warningArray);

  if (courseData.progression.length > 1) {
    warningArray.push('Kursprogression får endast bestå av ett tecken.')
  }
  
  if (warningArray.length > 0) {
    res.render('form', { 
      warningArray,
      courseData
    });
  } 
  else {
    try {
      const query = 'INSERT INTO courses(coursecode, coursename, syllabus, progression) VALUES($1, $2 ,$3, $4)'
      const values = [
        courseData.courseCode,
        courseData.courseName,
        courseData.syllabus,
        courseData.progression
      ];

      await client.query(query, values);

      res.redirect('/form?saved=true');
    } catch(error) {
      console.log(error);
      res.render('form', { 
        warningArray: ['Ett tekniskt fel uppstod när kursen skulle sparas.'], 
        courseData 
      });
    }
  }
}