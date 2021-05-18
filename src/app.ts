import express from 'express';

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/index.html');
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[Server] Listening on :${PORT}`);
});
