console.clear();

import React, { useState, useEffect } from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";

const PHRASE_API_HEAD = "http://localhost:3000/phrase";

function App() {
  const [phrases, setPrases] = useState(null);
  //랜덤으로 명언 출력
  const phraseRandom = async () => {
    const data = await fetch(`${PHRASE_API_HEAD}/random`);
    const json = await data.json();
    setPrases(json.data);
  };

  useEffect(phraseRandom, []);

  if (phrases === null) {
    return <>loading...</>;
  }
  //좋아요
  const clickLike = async () => {
    const data = await fetch(`${PHRASE_API_HEAD}/${phrases.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likePoint: phrases.likePoint + 1,
        dislikePoint: phrases.dislikePoint,
      }),
    });
    const json = await data.json();
    setPrases(json.data);
  };
  //싫어요
  const clickDisLike = async () => {
    const data = await fetch(`${PHRASE_API_HEAD}/${phrases.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likePoint: phrases.likePoint,
        dislikePoint: phrases.dislikePoint + 1,
      }),
    });
    const json = await data.json();
    setPrases(json.data);
  };

  //생성
  // const nesPhrase = async (author, content) => {
  //   const data = await fetch(`${PHRASE_API_HEAD}/new`,{
  //     method: "POST",
  //     headers:{
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       author: author,
  //       content: content
  //     })
  //   });
  //   const json = await data.json();
  //   setPrases(json.data);
  // }

  const onSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    if (form.author.value.length == 0) {
      alert("작가를 입력해주세요.");
      form.content.focus(); // 작가 입력창으로 포커스 이동
      return;
    }

    const author = form.author.value.trim();

    if (form.content.value.length == 0) {
      alert("명언을 입력해주세요.");
      form.content.focus();
      return;
    }

    const content = form.content.value.trim();

    const data = await fetch(`${PHRASE_API_HEAD}/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author,
        content,
      }),
    });
    const json = await data.json();
    setPrases(json.data);

    form.author.value = "";
    form.content.value = "";
  };

  return (
    <>
      <div class="fixed top-0 bg-[#ff8686] w-full">
        <div className="text-white p-[10px_10px_7px_10px] text-center">
          오늘의 명언
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-sm px-3">
          <div>{phrases.content}</div>
          <div className="text-center mt-2 text-gray-500 text-sm">
            - {phrases.author} -
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-sm mt-8 px-3">
              <div className="border p-2">
                <button>조회수 {phrases.hit}</button>
              </div>
              &nbsp;
              <div className="border p-2">
                <button onClick={clickLike}>좋아요 {phrases.likePoint}</button>
              </div>
              &nbsp;
              <div className="border p-2">
                <button onClick={clickDisLike}>
                  싫어요 {phrases.dislikePoint}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-sm px-3">
          <form onSubmit={onSubmit}>
            <div>
              <span>작가</span>&nbsp;
              <input name="author" type="text" className="border p-2" />
            </div>
            &nbsp;
            <div>
              <span>명언</span>&nbsp;
              <input name="content" type="text" className="border p-2" />
            </div>
            &nbsp;
            <div>
              <input type="submit" value="저장" className="border p-2" />
            </div>
          </form>
        </div>
      </div>

      <div class="fixed bottom-0 bg-[#ff8686] w-full flex justify-center">
        <button
          onClick={phraseRandom}
          className="text-white p-[15px_15px_10px_15px] cursor-pointer"
        >
          <i class="fa-solid fa-rotate-left"></i>
        </button>
      </div>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
