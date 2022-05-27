console.clear();

import React, { useState, useEffect } from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";

const HEAD = "https://jhs512.github.io/wise_saying_server/data.json";

function App() {
  //뭉텅이 데이터 저장할 변수
  const [phrases, setPhrases] = useState(null);
  //난수 저장할 변수
  const [index, setIndex] = useState(Math.floor(Math.random() * 124));

  const getPhrases = async () => {
    const data = await fetch(`${HEAD}`);
    const json = await data.json();
    setPhrases(json);
    // console.log(json);
  };

  useEffect(getPhrases, []);

  if (phrases === null) {
    return <>loading...</>;
  }

  const random = () => {
    //0 ~ 123까지 난수
    setIndex(Math.floor(Math.random() * phrases.length));
  };

  const next = () => {
    if (index == phrases.length - 1) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index == 0) {
      setIndex(phrases.length - 1);
    } else {
      setIndex(index - 1);
    }
  };

  return (
    <>
      <div class="fixed top-0 bg-[#ff8686] w-full">
        <div className="text-white p-[10px_10px_7px_10px] text-center">
          오늘의 명언, {phrases[index].id}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-sm px-3">
          <div>{phrases[index].content}</div>
          <div className="text-center mt-2 text-gray-500 text-sm">
            - {phrases[index].author} -
          </div>
        </div>
      </div>

      <div class="fixed bottom-0 bg-[#ff8686] w-full flex justify-between">
        <button
          onClick={prev}
          className="text-white p-[15px_15px_10px_15px] cursor-pointer"
        >
          <i class="fa-solid fa-angle-left"></i>
        </button>
        <button
          onClick={random}
          className="text-white p-[15px_15px_10px_15px] cursor-pointer"
        >
          <i class="fa-solid fa-rotate-left"></i>
        </button>
        <button
          onClick={next}
          className="text-white p-[15px_15px_10px_15px] cursor-pointer"
        >
          <i class="fa-solid fa-angle-right"></i>
        </button>
      </div>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
