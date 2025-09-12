"use client";

import './feed.css';
import PromptCardList from "../promptcard-list/promptcard-list"
import { useState, useEffect, useMemo } from 'react';

function Feed(props) {
  const {handleFeedPostClick} = props;  // destructuring the "props" object

  const [searchTerm, setSearchTerm] = useState('');
  const [retrievedPosts, setRetrievedPosts] = useState([]);  

  useEffect(()=>{
    const fetchPost = async() => {
      try{
        const response = await fetch('/api/prompt', {
          method: "GET",
        });

        const data = await response.json();        

        if(data.success === true){        
          setRetrievedPosts(data.result);     // retrievedPost is set a value here.          
        }
      } catch(error){
        console.error("Error retrieving posts. ", error);
      }
    };
    fetchPost();
  }, []);


  const handleSearchChange = (e) =>{
    setSearchTerm(e.target.value);
  }
 
  const handleSearchFilterPosts = useMemo(() => {    
    // if there is no search term (in which whitespaces can be removed), return the retrieved posts.
    if(!searchTerm.trim()){
      return retrievedPosts;
    }

    const term = searchTerm.toLowerCase();
    
    return retrievedPosts.filter(item => {
      if(item.creator.username && item.creator.username.toLowerCase().includes(term)){
        return true;  // i.e. returns the retrievedPosts that includes or has the search "term" in username
      }
      
      if(item.prompt && item.prompt.toLowerCase().includes(term)){
        return true; 
      }

      if(item.tag && item.tag.toLowerCase().includes(term)){
        return true; 
      }
      // returns nothing if the search "term" match none of the above "if" block. "retrievedPosts" is not filtered
      return false; 
    });
  }, [retrievedPosts, searchTerm]);

  return (
    <section className="feed">
      <form className="feed-form">
        <input 
          type='text' 
          className='feed-form-search' 
          placeholder='Search for post with username, prompt or tag'
          value={searchTerm}
          onChange={handleSearchChange}
          required
        />
      </form>

      <div>
        {handleSearchFilterPosts.length === 0
         && (
            <div className='feed-no-result'>
              {searchTerm 
               ? "No match found for the given search term in posts."
               : "No post available."
              }
            </div>
          )}
      </div>

      <p className='feed-posts'>Posts</p>
      
      <PromptCardList 
        dataGet={handleSearchFilterPosts}
        handlePostClick={handleFeedPostClick}
      />      
    </section>
  )
}

export default Feed