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
  dateStrings: true, // 날짜 시간 이뿌게
});

const app = express();
const port = 3000;

app.use(express.json());

const corsOptions = {
  origin: "https://cdpn.io",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors());

/* 명언 랜덤 출력 */
app.get("/phrase/random", async (req, res) => {
  const [[phraseRow]] = await pool.query(
    `SELECT * FROM phrase ORDER BY RAND() LIMIT 1`
  );

  if (phraseRow === undefined) {
    res.status(404).json({
      resultCode: "F-1",
      msg: "404 not found",
    });
    return;
  }

  phraseRow.hit++;

  await pool.query(`UPDATE phrase SET hit = hit + 1 WHERE id = ?`, [
    phraseRow.id,
  ]);

  // res.json([phraseRow]); //배열로 전달됬음...뭐지...?
  res.json({
    resultCode: "S-1",
    msg: "성공",
    data: phraseRow, //배열로 전달되지 않음
  });
});

//db수정
app.patch("/phrase/:id", async (req, res) => {
  const { id } = req.params;

  //아이디에 맞는 값들 가져오기
  const [[phraseRow]] = await pool.query(`SELECT * FROM phrase WHERE id = ?`, [
    id,
  ]);

  if (phraseRow === undefined) {
    res.status(404).json({
      resultCode: "F-1",
      msg: "404 not found",
    });
    return;
  }

  //받아온 값. 받아온 값이 없으면 기존의 값을 넣음
  const {
    content = phraseRow.content,
    author = phraseRow.author,
    likePoint = phraseRow.goodLikeCount,
    dislikePoint = phraseRow.badLikeCount,
  } = req.body;

  //업데이트
  await pool.query(
    `UPDATE phrase SET content = ?, author = ?, likePoint = ?, dislikePoint = ?
    WHERE id = ?`,
    [content, author, likePoint, dislikePoint, id]
  );

  //변경된 명언을 다시 불러옴
  const [[modifyPhraseRow]] = await pool.query(
    `SELECT * FROM phrase WHERE id = ?`,
    [id]
  );

  //데이터 전송
  res.json({
    result: "S-1",
    msg: "성공",
    data: modifyPhraseRow,
  });
});

//명언추가
app.post("/phrase/new", async (req, res) => {
  const { author, content } = req.body;

  if (!author) {
    res.status(400).json({
      resultCode: "F-1",
      msg: "author required",
    });
    return;
  }

  if (!content) {
    res.status(400).json({
      resultCode: "F-1",
      msg: "content required",
    });
    return;
  }

  const [insertRow] = await pool.query(
    `INSERT INTO phrase SET author = ?, content = ?`,
    [author, content]
  );

  await pool.query(`UPDATE phrase SET hit = hit + 1 WHERE id = ?`, [
    insertRow.insertId,
  ]);

  const [[newPhraseRow]] = await pool.query(
    `SELECT * FROM phrase WHERE id = ?`,
    [insertRow.insertId]
  );

  res.json({
    resultCode: "S-1",
    msg: "성공",
    data: newPhraseRow,
  });
});

/*좋아요
app.post("/phrase/like", async (req, res) => {
  const { id, likePoint } = req.body;

  if (!likePoint) {
    res.status(400).json({
      msg: "like required",
    });
    return;
  }

  await pool.query(
    `UPDATE phrase SET likePoint = likePoint + ?
    WHERE id = ?`,
    [likePoint, id]
  );

  // res.json(rows);
  res.status(201).json({
    msg: "성공",
  });
});
*/

/*싫어요
app.post("/phrase/dislikes", async (req, res) => {
  const { id, dislikePoint } = req.body;

  if (!dislikePoint) {
    res.status(400).json({
      msg: "dislike required",
    });
    return;
  }

  await pool.query(
    `UPDATE phrase SET dislikePoint = dislikePoint + ?
    WHERE id = ?`,
    [dislikePoint, id]
  );

  // res.json(rows);
  res.status(201).json({
    msg: "성공",
  });
});
*/

app.listen(port);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
