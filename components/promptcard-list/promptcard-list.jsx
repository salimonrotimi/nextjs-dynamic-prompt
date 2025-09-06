"use client";

import "./promptcard-list.css";
import PromptCard from "@components/prompt-card/prompt-card";

const PromptCardList = (props) => {
  const {dataGet, handlePostClick} = props    // destructuring the "props"

  return (
    <div className='promptcard-list'>
      {dataGet.map((dataItem)=>{
        return <PromptCard
                  key={dataItem._id}
                  post={dataItem}
                  handlePost={() => handlePostClick && handlePostClick(dataItem)}
                />
      })}
    </div>
  );
}

export default PromptCardList