"use client";

import './prompt-card.css'
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LikedPostModal from '@components/liked-post-modal/liked-post-modal';
import { formatCreatedTime } from '@utils/format-time';

function PromptCard(props) {
  // The values of post, handleTag are passed down from the "PromptCardList" component in "component/feed" 
  // path. That of handleEdit, handleDelete are passed down from the "profile" page in app/profile path.
  const {post, handlePost, handleEdit, handleDelete} = props   // destructure the "props" object.
  // handleEdit, handleDelete are newly added, they are not part of the "props" initially 
  const [copied, setCopied] = useState('');
  
  const [likeData, setLikeData] = useState({
    totalLikeCount: 0,
    isLiked: false,
  });

  const [isCommented, setIsCommented] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const {data: session} = useSession();      //destructure "data" and rename to session

  // FETCH LIKES FROM POST
  useEffect(()=>{
    const fetchLikeData = async() =>{
      try {
        const response = await fetch(`/api/prompt/${post._id}/like`, {
          method: "GET",
        });

        const data = await response.json();
        if(data.success === true){
          // set the like data
          setLikeData({
            totalLikeCount: data.totalLikes,
            isLiked: data.isLikedByUser,  // isLiked will be "false" once data has not been in the DB before
          });
        }
      } catch (error) {
        console.error("Error fetching likes: ", error)
      }
    }
    fetchLikeData();
  }, [post._id]);


    // FETCH COMMENT RECORDS
    useEffect(()=>{
        const fetchComment = async() => {
            try{          
                const response = await fetch(`/api/prompt/${post._id}/comments`, {
                    method: "GET",
                });
            
                const data = await response.json();        
            
                if(data.success === true){        
                    setCommentCount(data.totalComments);
                    setIsCommented(true);     // isCommented becomes true here
                }
            }catch(error){
                console.error(error);
            }
        };

        fetchComment();    // fetch the comments records for the given post id     
    }, [post._id]);

  // HANDLE LIKES AND UNLIKE
  const handleLiked = async (e) => {
    if(!session){
      toast.error("You need to login to like this post.");
      return router.push("/login");
    }

    try {
      // if isLiked is "true" go to the unlike endpoint, if isLiked is "false" go to the like endpoint
      const endpoint = likeData.isLiked ? `/api/prompt/${post._id}/unlike` : `/api/prompt/${post._id}/like`;
      const endpointMethod = likeData.isLiked ? "DELETE" : "POST";
      
      // No need for body here. The post id and the user session id are the body of the like post by default
      const response = await fetch(endpoint, {
          method: endpointMethod,
          headers: {
            "Content-Type": "application/json",
          },
      });

      const data = await response.json();
      
      if(data.success === true){
        // Update the UI optimistically without calling the result values from the database
        setLikeData((prevState)=>({
          ...prevState, // unpack the previous state data then update the value
          isLiked: !prevState.isLiked,
          totalLikeCount: prevState.isLiked ? prevState.totalLikeCount - 1 : prevState.totalLikeCount + 1,
        }));
      }else{
        toast.error(data.error_message);
      }
    } catch (error) {
      console.error("Error toggling like...", error);
    }
  }

  // HANDLE COMMENTS
  const handleComment = (e) => {
    if(!session){
      toast.error("You need to login to comment on this post.");
      return router.push("/login");
    }
    // do these if session
    return router.push(`/comment?postId=${post._id}`);
  }

  // HANDLE COPY
  const handleCopy = (e) => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);   // "navigator" is a default "window" method
    toast.success("Post copied to clipboard.");    
    setTimeout(()=>setCopied(''), 3000); // changes "copied" back to '' after 3 secs, which changes the image    
  }

  // HANDLING POP UP MODAL
  const [isModalOpen, setIsModalOpen] = useState(false)
  // open modal and close modal function
  const openModal = () => {
    setIsModalOpen(true);   // "isModalOpen" becomes "true" here.
  }
  const closeModal = () => {
    setIsModalOpen(false);  // // "isModalOpen" is set back to "false" here.
  }

  // the "dangerouslySetInnerHTML={{__html: post.prompt}}" makes it possible to run html tags in the post.
  return (
    <div className='prompt-card-container'>
      <div className='prompt-card'>
        <div className="prompt-card-item">
          <Image 
            src={post.creator.image} 
            alt='Creators profile image'
            className='prompt-card-image'
            width={30}
            height={30}
            onClick={handlePost}          
          />

          <div className='prompt-card-creator' onClick={handlePost}  >
            <div>{post.creator.username}</div>
            <p>{post.creator.email}</p>
          </div>

          <div className="prompt-card-copy" onClick={handleCopy}>          
            <Image 
              src={copied === post.prompt ? "/assets/images/tick.png" : "/assets/images/copy.png"}
              alt='Copy prompt'
              width={25}
              height={25}
              className='prompt-card-copy-image'
            />            
          </div>       
        </div>
        <div className='prompt-card-details'>
          <div className='prompt-card-prompt' dangerouslySetInnerHTML={{__html: post.prompt}}/>
          <p className='prompt-card-tag'>{post.tag}</p>
        </div>
        
        {(session?.user.id === post.creator._id && pathname === "/profile") 
          ? <div className='prompt-card-all'>
              <span className='format-time'>{formatCreatedTime(post.createdAt)}</span>

              <div className="prompt-card-edit-delete">
                <div className='prompt-card-edit' onClick={handleEdit}>
                  <Image src={"/assets/images/edit-icon.png"} alt='Edit post' width={18} height={18}/>
                  <span>Edit</span>
                </div>
                <div className='prompt-card-delete' onClick={handleDelete}>
                  <Image src={"/assets/images/delete-icon.png"} alt='Delete post' width={25} height={25}/>
                  <span>Delete</span>
                </div>
              </div>              
            </div>
          : <div className='prompt-card-comment-like'>
              <span className='format-time'>{formatCreatedTime(post.createdAt)}</span>

              <div className='prompt-card-comment'>                            
                <div className='comment'>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={isCommented ? "#92C0EEFF" : "none"} xmlns="http://www.w3.org/2000/svg" className='prompt-card-comment-icon'>
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>
                    {commentCount} <span onClick={handleComment}>{(commentCount > 1) ? "Comments" : "Comment"}</span>
                  </span>
                </div>
              </div>

              <div className='prompt-card-like'>
                <div className='like'>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={likeData.totalLikeCount ? "#dc2626" : "none"} xmlns="http://www.w3.org/2000/svg" className='prompt-card-like-icon'>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>
                    {likeData.totalLikeCount} <span onClick={handleLiked}>{(likeData.totalLikeCount > 1) ? "Likes" : "Like"}</span>                     
                  </span>
                </div>
                <span className='like-view' onClick={openModal}>View</span>
              </div>
            </div>
        }
      </div>

      {/* Image Modal */}
      <div>
        <LikedPostModal
          post = {post}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>      
    </div>
  )
}

export default PromptCard