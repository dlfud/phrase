console.clear();

import React, { useState, useEffect } from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";

function App() {
  const [like, setLike] = useState(1);
  const [dislike, setDislike] = useState(1);

  const [phrases, setPhrases] = useState([]);

  const [next, setNext] = useState(0);

  const [id, setId] = useState();

  //랜덤으로 명언 가져옴
  const random = async () => {
    const data = await fetch(`http://localhost:3000/phrase`);
    const json = await data.json();
    setPhrases(json);
    setId(json[0]?.id); // 배열로 받아와서 그랬나?
    console.log(id);
  };

  useEffect(random, [next]);

  //좋아요 반영
  const clickLike = async () => {
    await fetch(`http://localhost:3000/phrase/like`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //보내줄 데이터
        id: id,
        likePoint: like,
      }),
    });
    // await random();
  };
  // 싫어요 반영
  const clickDisLike = async () => {
    await fetch(`http://localhost:3000/phrase/dislikes`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //보내줄 데이터
        id: id,
        dislikePoint: dislike,
      }),
    });
    // await random();
  };

  const nextId = () => {
    setNext(next + 1);
  };

  return (
    <>
      <ul>
        {phrases.map((phrase, index) => (
          <li key={index}>
            {phrase.id} / {phrase.regDate} /{phrase.content} / {phrase.author} /
            {phrase.hit} / {phrase.likePoint} / {phrase.dislikePoint}
          </li>
        ))}
      </ul>
      <button onClick={clickLike}>좋아요</button>
      &nbsp;
      <button onClick={clickDisLike}>싫어요</button>
      &nbsp;
      <button onClick={nextId}>다음명언</button>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
