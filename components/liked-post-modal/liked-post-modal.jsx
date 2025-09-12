'use client';

import "./liked-post-modal.css";
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function LikedPostModal(props) {
  const { post, isOpen, onClose} = props; // destructuring of the props object.
  const [likedByUser, setLikedByUser] = useState([]);

   // useEffect() to fetch "likes" from post
    useEffect(()=>{
      const fetchLikeData = async() =>{
        try {
          const response = await fetch(`/api/prompt/${post._id}/like/users`, {
            method: "GET",
          });
  
          const data = await response.json();
          if(data.success === true){
            // set the like data
            setLikedByUser(data.result);
            
          }
        } catch (error) {
          console.error("Error fetching likes: ", error)
        }
      }
      fetchLikeData();
    }, [post._id]);


  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'keyup') {
        onClose();  // function that set "isOpen" to false
      }
    }

    // "isOpen" receives "true" from the "isModalOpen" variable in the "Profile" component in "profile.jsx" file
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    // return a function that removes event listener in order to be able to scroll the body again
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
    
  }, [isOpen, onClose])

  // if "isOpen" is "false", don't open the pop-up modal, just continue with the background page
  if (!isOpen) {
    return null;
  }

  // if "isOpen" is "true", do the following to open the modal
  return (
    <div className="modal-image-modal" onClick={onClose}>
        {/* "e.stopPropagation" prevent passing click to the button (which close the modal) when clicking image */}
        <div className="like-modal-container" onClick={(e) => e.stopPropagation()}>        
            <button onClick={onClose} className="modal-close-btn">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="like-modal-content">
                <div className="like-modal-post">
                    <h3> Post made by <span className="like-modal-post-username">@{post.creator.username}</span>:</h3>
                    <p dangerouslySetInnerHTML={{__html: post.prompt}}/>
                </div>

                <div className="like-modal-post-likedby">
                    <span> Liked by: </span>
                    {likedByUser.length === 0
                     ? <p className="no-likes">No likes yet.</p>
                     : likedByUser.map((dataItem, index)=>{
                        return (
                            <div className="liked-modal-details" key={index}>
                                <div className="liked-modal-details-inner">
                                    <Image 
                                        src={dataItem.likedBy.image} 
                                        alt='Liked by user'                            
                                        width={30}
                                        height={30}
                                        className='liked-user-image'        
                                    />
                    
                                    <div className='liked-user-details'>
                                        <div>{dataItem.likedBy.username}</div>
                                        <p className="liked-user-email">{dataItem.likedBy.email}</p>
                                    </div>
                                </div>                            

                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#dc2626" xmlns="http://www.w3.org/2000/svg" className='prompt-card-like-icon'>
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>    
                            </div>
                        )
                    })}
                </div>                
            </div>
        </div>
    </div>
  )
}