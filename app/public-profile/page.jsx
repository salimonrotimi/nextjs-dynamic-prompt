"use client";

import "./page.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Profile from "@components/profile/profile";
import PromptCardList from "@components/promptcard-list/promptcard-list";
import { use } from "react";


const PublicProfilePage = ({searchParams}) => {
    const [retrievedPost, setRetrievedPost] = useState({});
    const [postsByUser, setPostsByUser] = useState([]);
    
    const {id: postId, quotient: paramsUsername, factor: paramsImage} = use(searchParams);    

    useEffect(()=>{
      const fetchPost = async() => {
        try{  
          // fetch data from a dynamic id i.e. [id] in the "prompt" api route i.e "/api/prompt". "postId" 
          // is "params" since it passes the "id" directly to the API and the URL does not have "?".
          const response = await fetch(`/api/prompt/${postId}`, {
            method: "GET",
          });
    
          const data = await response.json();        
    
          if(data.success === true){        
            setRetrievedPost(data.result);
          }
        }catch(error){
          console.error(error);
        }
      };
          
      fetchPost();    // fetch the data if the session user id exist
      
    }, [postId]);

    useEffect(()=>{
      const fetchPostsByUser = async() => { 
        try {   
          // fetch data from a dynamic id i.e. [id] in the "user" api route i.e "/api/user". "session?.user.id" 
          // is "params" since it passes the "id" directly to the API and the URL does not have "?".
          const response = await fetch(`/api/user/${retrievedPost.creator?._id}/posts`, {
            method: "GET",
          });
    
          const data = await response.json();        
    
          if(data.success === true){        
            setPostsByUser(data.result);
          }
        } catch(error){
          console.error("Error getting posts. ", error);
        }
      };

      if(retrievedPost.creator?._id){
          fetchPostsByUser();    // fetch the data if the session user id exist
      }        
    }, [retrievedPost.creator?._id]);


  return (
    <div className="public-profile">        
      <Profile
        name={paramsUsername}
        profileImage={paramsImage}
        description="Welcome to users' public profile page."
      />

      <p className="public-profile-details">
        Recent posts from user @{paramsUsername}
      </p>
      
      <PromptCardList 
        dataGet={postsByUser}
      />        
    </div>
  )
}

export default PublicProfilePage