"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Profile from "@components/profile/profile";
import toast from "react-hot-toast";

const ProfilePage = () => {
    
    const {data: session} = useSession();
    const [retrievedPosts, setRetrievedPosts] = useState([]);
    const router = useRouter();
   
    if(!session){
      redirect("/login");
    }

    useEffect(()=>{
        const fetchPost = async() => { 
          try {   
            // fetch data from a dynamic id i.e. [id] in the "user" api route i.e "/api/user". "session?.user.id" 
            // is "params" since it passes the "id" directly to the API and the URL does not have "?".
            const response = await fetch(`/api/user/${session?.user.id}/posts`, {
              method: "GET",
            });
      
            const data = await response.json();        
      
            if(data.success === true){        
              setRetrievedPosts(data.result);
            }
          } catch(error){
            console.error("Error getting posts. ", error);
          }
        };

        if(session?.user.id){
            fetchPost();    // fetch the data if the session user id exist
        }        
      }, [session?.user.id]);

    // The handleEditProfile() function is passed down from here to the "profile" component which is used 
    // on the "update-prompt" page.
    const handleEditPost = async(postItem) => {
      router.push(`/update-prompt?promptId=${postItem._id}`);
    }

    const handleDeletePost = async(postItem) => {
      const confirmDelete = confirm("Are you sure you want to delete this post? This action cannot be reversed.");
      
      if(!confirmDelete) return;

      try {
        const response = await fetch(`/api/prompt/${postItem._id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if(data.success === true){
          // filtered or gather the remaining posts after deletion
          const filteredPosts = retrievedPosts.filter(item => item._id !== postItem._id);
          setRetrievedPosts(filteredPosts);
          toast.success(data.message);
        }
      } catch (error) {
        toast.error(data.error_message);
        console.error(error);
      }    
    }

  return (
    <div>
        <Profile
            name={session?.user.name}
            profileImage={session.user.image}
            description="Welcome to your personal profile page"
            recent="Recent posts"
            data={retrievedPosts}
            handleEditClick={handleEditPost}
            handleDeleteClick={handleDeletePost}
        />
    </div>
  )
}

export default ProfilePage