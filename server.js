const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
    server: 'localhost', // or 'localhost' if default instance
    database: 'BusTrackDB',
    driver: 'msnodesqlv8',           // important!
    options: {
        trustedConnection: true       // enables Windows Authentication
    }
};

  



/* ---------- feedback --------- */
app.post('/api/feedback', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const { name, email, message } = req.body;
    await pool.request()
      .input('name', sql.VarChar, name)
      .input('email', sql.VarChar, email)
      .input('message', sql.VarChar, message)
      .query('INSERT INTO Feedback (Name, Email, Message) VALUES (@name, @email, @message)');
    res.send('✅ Feedback saved successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Feedback saved successfully!');
  }
});

/* ---------- contact --------- */
app.post('/api/contact', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const { name, email, subject, message } = req.body;
    await pool.request()
      .input('name', sql.VarChar, name)
      .input('email', sql.VarChar, email)
      .input('subject', sql.VarChar, subject)
      .input('message', sql.VarChar, message)
      .query('INSERT INTO Contact (Name, Email, Subject, Message) VALUES (@name, @email, @subject, @message)');
    res.send('✅ Contact message saved successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send(' Contact message saved successfully!');
  }
});

/* ---------- Start server LAST ---------- */
app.listen(5000, () => console.log('✅ Server running on http://localhost:5000'));
