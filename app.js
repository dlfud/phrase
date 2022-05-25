import express from "express"; // import로 가져옴
import mysql from "mysql2/promise";
import cors from "cors";

const pool = mysql.createPool({
    host: "localhost",
    user: "sbsst", // 사용자이름
    password: "sbs123414", // 비번
    database: "phrase", // 데이터 베이스
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

const app = express()
const port = 3000

app.use(express.json());

const corsOptions = {
  origin: "https://cdpn.io",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors());

/* 명언 랜덤 출력 */
app.get('/phrase', async (req, res) => {
    
    const[[row]] = await pool.query(
        `SELECT * FROM phrase ORDER BY RAND() LIMIT 1`
    );

    await pool.query(
        `UPDATE phrase SET hit = hit + 1 WHERE id = ?`,
        [row.id]
    );
    res.json([row]);
    // res.json({
    //   data: [row.id],
    // });
});

app.patch('/phrase', async (req, res) => {
  // const{id} = req.params;
  const{id, likePoint, dislikePoint} = req.body;

  if(!likePoint){
    res.status(400).json({
      msg:"like required",
    })
    return;
  }

  if(!dislikePoint){
    res.status(400).json({
      msg:"like required",
    })
    return;
  }

  await pool.query(
    `UPDATE phrase SET likePoint = likePoint + ?, dislikePoint = dislikePoint + ?
    WHERE id = ?`, [likePoint, dislikePoint, id]
  );

  res.json(rows);
  // res.status(201).json({
  //   msg:"성공",
  // });
});

app.listen(port);


// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })