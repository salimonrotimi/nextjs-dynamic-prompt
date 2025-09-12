"use client";

import CommentForm from '@components/comment-form/comment-form';
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import { redirect } from "next/navigation";
import toast from 'react-hot-toast';
import { use } from 'react';    // for extracting the query variables from a URL


function CommentSection({searchParams}) {
    // The name of the function argument must be "searchParams" to be able to extract variables from the URL
    const {postId} = use(searchParams); // use the postId to retrieve a particular post records
    const {data: session} = useSession();
    const [retrievedPost, setRetrievedPost] = useState({
        createdBy: "",
        prompt: "",
        tag: "",
        createdAt: "",
    });

    // For creating comment
    const [isSubmitting, setIsSubmitting] = useState(false);    // isSubmitting is "false" here
    const [newComment, setNewComment] = useState("");
    // For showing the comments after it has been added
    const [allComments, setAllComments] = useState([]);
    // For editting the comments after it has been shown
    const [editText, setEditText] = useState('');

    if(!session){
        redirect("/login");
    }

    // FETCH POST RECORDS FOR DISPLAYING THE POST
    useEffect(()=>{
        const fetchPost = async() => {
            try{
                // "postId" now becomes a "params" at the destination API handler since the URL does not have "?"
                const response = await fetch(`/api/prompt/${postId}`, {
                    method: "GET",
                });
                const data = await response.json();
                // setRetrievedPost() to make the "retriebvedPost" variable to have a value.
                if(data.success === true){
                    setRetrievedPost({
                        createdBy: data.result.creator.username,
                        image: data.result.creator.image,
                        prompt: data.result.prompt,
                        tag: data.result.tag,
                        createdAt: data.result.createdAt,
                    });
                }
            } catch(error){
                console.error(error);
            }            
        }
        
        fetchPost();  // fetch the posts records for the given post id  
    }, [postId]);

    // FETCH COMMENT RECORDS
    useEffect(()=>{
        const fetchComment = async() => {
            try{          
                const response = await fetch(`/api/prompt/${postId}/comments`, {
                    method: "GET",
                });
            
                const data = await response.json();        
            
                if(data.success === true){        
                    setAllComments(data.result);
                }
            } catch(error){
                console.error(error);
            }
        };
          
        fetchComment();    // fetch the comments records for the given post id     
    }, [postId]);

    // ADD COMMENT
    const addComment = async(e) => {
        e.preventDefault()
        setIsSubmitting(true);  // is Submitting becomes true.
    
        try {
          const response = await fetch(`/api/prompt/${postId}/comments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              commentText: newComment.trim(),
            }),
          });
    
          const data = await response.json();
    
          if(data.success === true){
            // set the "data result" (i.e. the new comment) at the beginning of the comments array.
            setAllComments(prevState => [data.result, ...prevState]);
            setNewComment('');
            toast.success(data.message);
            return true;
          }
        } catch (error) {
          toast.error("Error creating comment.");
          console.log(error);
        } finally{
          setIsSubmitting(false);   // isSubmitting changes back to false.
        }
    }

    // EDIT COMMENT
    const editComment = async(e, commId) => {
        e.preventDefault();
        
        // if there is no edit text, return or do nothing
        if(!editText.trim()) return

        try {
        const response = await fetch(`/api/comment/${commId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                commentText: editText.trim(), // "commentText" is destructured on the backend API from "request.json()""
            }),
        });
    
        const data = await response.json();
    
        if(data.success === true){
            // Load the previous comment (i.e. prevState) and edit the data where _id equals the comment id
            // During edit, mapping through the previous comments (i.e. prevState.map()) gives error.
            setAllComments(prevState => {
                // find the index in the previous comment where the id is equal to the function "commId"
                const commentIndex = prevState.findIndex(eachItem => eachItem._id === commId);
                // if no comment index (i.e. -1), return the previous state or comments
                if(commentIndex === -1) {
                    return prevState;
                }
                // create new array to update the new comment. This prevent error of editing the previous array
                const newAllComments = [...prevState];
                // Locate the index where the id are equal (in the previous comments) in the new comments,
                // unpack the comment (in the object) at that index and replace with the comment to be updated
                newAllComments[commentIndex] = {
                    ...newAllComments[commentIndex],          // unpack the comment at that index
                    comment: data.result.comment,           // update record
                }
                // return the newly updated set of comments
                return newAllComments;  // this becomes the new value of "allComments"
            });

            setEditText('');
            toast.success(data.message);
            return true;
        }
        } catch (error) {
            toast.error("Error creating comment.");
            console.log(error);
        } 
    }

    // DELETE COMMENT
    const deleteComment = async(commId) => {
        const confirmDelete = confirm("Are you sure you want to delete this comment? This action cannot be reversed.");
      
      if(!confirmDelete) return;

      try {
        const response = await fetch(`/api/comment/${commId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if(data.success === true){
          // filtered or gather the remaining comments (where the id are not equal) after deletion
          const filteredComments = allComments.filter(eachItem => eachItem._id !== commId);
          setAllComments(filteredComments);
          toast.success(data.message);
        }
      } catch (error) {
        toast.error(data.error_message);
        console.error(error);
      }
    }


    return (
        <div>
            <div>
                <CommentForm
                    type={editText ? "Edit" : "Add"}
                    postRecord={retrievedPost}
                    submitting={isSubmitting}
                    newComment={newComment}                    
                    setNewComment={setNewComment}
                    editText={editText}                    
                    setEditText={setEditText}
                    allComments={allComments}
                    handleSubmit={addComment}
                    handleEdit={editComment}
                    handleDelete={deleteComment}
                />
            </div>
        </div>
    )
}

export default CommentSection