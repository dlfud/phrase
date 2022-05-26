console.clear();

import React, { useState, useEffect } from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";

const PHRASE_API_HEAD = "http://localhost:3000/phrase";

function App(){
  //명언 받아올 변수
  const [phrases, setPhrases] = useState(null);
  
  //랜덤으로 명언 가져옴
  const phraseRandom = async () => {       
    const data = await fetch(`${PHRASE_API_HEAD}/random`);
    const json = await data.json();
    setPhrases(json.data);
  }
  
  useEffect(phraseRandom, []);
  //값이 없을 때는 로딩중이라고 뜸
  if(phrases === null){
    return <>Loading...</>
  };
  
  //싫어요 누름
  const clickLike = async () => {
    //수정할 데이터 보냄
    await fetch(`${PHRASE_API_HEAD}/${phrases.id}`,{
      method: "PATCH",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        likePoint: phrases.likePoint + 1
      })
    });
    
    //원래 있던 데이터를 수정
    const newPhrase = {
      ...phrases,
      likePoint: phrases.likePoint + 1
    };
    setPhrases(newPhrase);
  };
  
  const clickDisLike = async () => {
    //수정할 데이터 보냄
    await fetch(`${PHRASE_API_HEAD}/${phrases.id}`,{
      method: "PATCH",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        dislikePoint: phrases.dislikePoint + 1
      })
    });
    
    //원래 있던 데이터를 수정
    const newPhrase = {
      ...phrases,
      dislikePoint: phrases.dislikePoint + 1
    };
    setPhrases(newPhrase);
  }
  
  return (
    <>
      <div>
        작가 : {phrases.author}
        <br/>
        명언 : {phrases.content}
        <br/>
        조회수 : {phrases.hit} 
        <br/>
        좋아요 : {phrases.likePoint}
        <br/>
        싫어요 : {phrases.dislikePoint}
      </div>
      <button onClick={clickLike}>좋아요</button>
      &nbsp;
      <button onClick={clickDisLike}>싫어요</button>
      &nbsp;
      <button onClick={phraseRandom}>다음명언</button>
    </>
  );
}

ReactDOM.render(<App/>, document.getElementById("root"));

