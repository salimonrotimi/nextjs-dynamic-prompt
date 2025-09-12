"use client";   // added mainly because of the react hooks

import toast from "react-hot-toast"
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import FormComponent from "@components/form/form-component";
import { use } from "react";    // for extracting the query variables from a URL


function EditPrompt({searchParams}) {
  // The name of the function argument must be "searchParams" to be able to extract variables from the URL
  const {data: session} = useSession(); // For client-side page route protection. "data" renamed as "session"
  const router = useRouter();   // for page navigation
  const {promptId} = use(searchParams); // for grabbing the "id" passed from one web page to another through 
  // a URL. The URL usually have a question mark '?' in it, e.g, "/update-prompt?id=68b2a73ef2e1d3a431895be3"
  // that was passed from the "profile" page to the "update-prompt" page.

  let isSubmitting = false;  
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
  });

  if(!session){
    redirect("/login");
  }

  // Fetch th data for the edit form-field immediately the form loads.
  useEffect(()=>{
    const getPromptDetails = async() => {
        // "promptId" now becomes a "params" at the destination API handler since the URL does not have "?"
        const response = await fetch(`/api/prompt/${promptId}`, {
            method: "GET",
        });
        const data = await response.json();
        // setPost() to make the "post" variable to have a value.
        setPost({
            prompt: data.result.prompt,
            tag: data.result.tag,
        });
    }
    getPromptDetails();
  }, [promptId]);

  // UPDATE
  const updatePrompt = async(e) => {
    e.preventDefault()
    isSubmitting = true;

    if(!promptId){
        toast.error("Prompt ID not found");
    }

    try {
      // "promptId" now becomes a "params" at the destination API handler since the URL does not have "?"
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: post.prompt,       
          tag: post.tag,
        }),
      });

      const data = await response.json();

      if(data.success === true){
        toast.success(data.message);     
        if(session) {
          router.push('/profile');   // go back to the profile page
          return true;
        }        
      }
    } catch (error) {
      toast.error("Error updating post.");
      console.log(error);
    } finally{
      isSubmitting = false;
    }
  }

  return (
    <div>
      <FormComponent
        type="Edit"
        post={post}
        setPost={setPost}
        submitting={isSubmitting}
        handleSubmit={updatePrompt}
      />
    </div>
  )
}

export default EditPrompt