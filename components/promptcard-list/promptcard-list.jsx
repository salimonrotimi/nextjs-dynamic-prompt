"use client";

import "./promptcard-list.css";
import PromptCard from "@components/prompt-card/prompt-card";

const PromptCardList = (props) => {
  const {dataGet, handlePostClick} = props    // destructuring the "props"

  // reverse the order of the data gotten to sort it to the most recent first
  const dataObtained = [...dataGet].reverse();

  return (
    <div className='promptcard-list'>
      {dataObtained.map((dataItem)=>{
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