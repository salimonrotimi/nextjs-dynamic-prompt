"use client";   // added mainly because of the react hooks

import toast from "react-hot-toast"
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { validatePost } from "@utils/validator";
import FormComponent from "@components/form/form-component";



function CreatePrompt() {

  const {data: session} = useSession(); // For client-side page route protection. "data" renamed as "session"
  const router = useRouter();   // for page navigation
  let isSubmitted = false;
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
  });

  if(!session){
    redirect("/login");
  }

  const addPrompt = async(e) => {
    e.preventDefault()
    isSubmitted = true;

    try {
      const response = await fetch('/api/prompt/new', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          prompt: post.prompt,       
          tag: post.tag,
        }),
      });

      const data = await response.json();

      if(data.success === true){
        toast.success(data.message);
        router.push('/');   // go back to the home page
        return true;
      }
    } catch (error) {
      toast.error("Error creating post.");
      console.log(error);
    } finally{
      isSubmitted = false;
    }
  }

  return (
    <div>
      <FormComponent
        type="Create"
        post={post}
        setPost={setPost}
        submitting={isSubmitted}
        handleSubmit={addPrompt}
      />
    </div>
  )
}

export default CreatePrompt