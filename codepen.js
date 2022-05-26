console.clear();

import React, { useState, useEffect } from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";


function App(){
  //좋아요 싫어요 변수(일단 1씩 증가)
  const[like, setLike] = useState(1);
  const[dislike, setDislike] = useState(1);
  //개수
  const[likeCount, setLikeCount] = useState(0);
  const[dislikeCount, setDislikeCount] = useState(0);
  //명언 받아올 변수
  const [phrases, setPhrases] = useState([]);
  //id받아올 변수
  const [id, setId] = useState(0);
  
  //랜덤으로 명언 가져옴
  const random = async () => {       
    const data = await fetch(`http://localhost:3000/phrase/random`);
    const json = await data.json();
    setPhrases(json);
    setId(json[0]?.id); // 배열로 받아와서 그랬나?
    console.log(likeCount);
  }
  
  useEffect(random, []);
  
  const nextId = () => {
    setNext(next + 1);
  };
  
  //좋아요 반영
  const clickLike = async () => {
    await fetch(`http://localhost:3000/phrase/like`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ //보내줄 데이터
        id: id,
        likePoint: like
      })
    });
    setLikeCount(likeCount + like);
  };
  
  // 싫어요 반영
  const clickDisLike = async () => {
    await fetch(`http://localhost:3000/phrase/dislikes`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ //보내줄 데이터
        id: id,
        dislikePoint: dislike
      })
    });
    setDislikeCount(dislikeCount + dislike);
  };
  
  return (
    <>
      <ul>
        {phrases.map((phrase, index) => (
          <li key={index}>
            {phrase.id} / {phrase.regDate} / 
            {phrase.content} / {phrase.author} / 
            {phrase.hit} / {phrase.likePoint + likeCount} / {phrase.dislikePoint + dislikeCount}
          </li>
        ))}
      </ul>
        <button onClick={clickLike}>좋아요</button>
        &nbsp;
        <button onClick={clickDisLike}>싫어요</button>
        &nbsp;
        <button onClick={random}>다음명언</button>
    </>
  );
}

ReactDOM.render(<App/>, document.getElementById("root"));

