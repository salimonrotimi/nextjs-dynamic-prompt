"use client";

import "./comment-form.css";
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import {useSession} from 'next-auth/react';
import { formatCreatedTime } from "@utils/format-time";

function CommentForm(props) {
  // "props" refers to all the properties that are added to the <Form /> tag anywhere it is called

  const {type, postRecord, submitting, newComment, setNewComment, editText, 
          setEditText, allComments, handleSubmit, handleEdit, handleDelete} = props;
  const [isValidated, setIsValidated] = useState(submitting); // "submitting" is passed to the "Form" as false
  const [editCommentId, setEditCommentId] = useState(null); // ffor grabbing the 
  const {data: session} = useSession();

  const cancelForm = () => {
    if(editText) {
      setEditText('');
    }
    if(newComment){
      setNewComment('');
    }
  }

  const handleChecked = (e) => {
    setIsValidated(!isValidated);
  }

  // activate the editing process (similar to passing an id into a URL and using useEffect to get the id data)
  const startEditing = (dataObject) => {
    // dataObject is replaced with "dataItem" when the function is called during "allComments.map()".
    setEditCommentId(dataObject._id.toString());
    setEditText(dataObject.comment);
    window.scrollTo(0,0);   // scroll back to the top
  }


  return (
    <section className='post-comment-section'>
      {/* POST */}
      <div className="post-header-container">
        <div className='post-header'>
          <div className="post-header-image">
            <Image 
              src={postRecord.image}
              alt="Post author's image"
              width={28}
              height={28}
              className="post-image"
            />
          </div>         
          <div className="post-creator-details">
            <span className='post-created-by'>{postRecord.createdBy}</span>
            <span className="post-time-creation">{formatCreatedTime(postRecord.createdAt)}</span>
          </div>
        </div>

        <div className="post-record-details">
          <span dangerouslySetInnerHTML={{__html: postRecord.prompt}}/>
          <span>{postRecord.tag}</span>
        </div>
      </div>    

      {/* FORM */}
      <form onSubmit={editText ? (event)=>handleEdit(event, editCommentId) : handleSubmit} className='submit-form'>
        <label>
          <span className='form-label-span'>{type} Comment</span>

          {editText
           ? <span className="textarea-character-count">{editText.length}/200</span>
           : <span className="textarea-character-count">{newComment.length}/200</span>
          }

          {editText
           ? <textarea
                className='form-textarea'
                value={editText}
                name='comment'
                onChange={(event) => setEditText(event.target.value)}
                placeholder='Edit your comment here...'
                rows={3}
                maxLength={200}
                required
              />
           : <textarea
                className='form-textarea'
                value={newComment}
                name='comment'
                onChange={(event) => setNewComment(event.target.value)}
                placeholder='Write your comment here...'
                rows={3}
                maxLength={200}
                required
              />
          }
        </label>              

        <div className='form-div-validate'>
          <input type='checkbox' className='form-checkbox' onChange={handleChecked} checked={isValidated}/>
          <span className='form-label-span'>I have confirmed that my inputs are correct.</span>
        </div>

        <div className='form-div-submit'>
          <button className='form-cancel' onClick={cancelForm}>
            Cancel
          </button>

          <button type='submit' className='form-btn' disabled={!isValidated}>
            {isValidated ? `${type}...` : type}
          </button>                    
        </div>        
      </form>
      
      {/* COMMENT */}
      <div className="all-comments-container">
        {allComments.length === 0
         ? <p className="no-comments">No comments yet. Be the first to add a comment.</p>

         : allComments.map((dataItem, index)=>{
              return <div className="all-comments" key={index}>
                        <Image
                          src={dataItem.postedBy.image}
                          alt="Comment author image"
                          width={28}
                          height={28}
                          className="comment-image"
                        />
                        
                        <div className="comment-overview">
                          <span className="comment-author">{dataItem.postedBy.username}</span>
                          <span className="comment-details">{dataItem.comment}</span>
                          <span className="comment-time-indicator">
                            <span className="comment-time">{formatCreatedTime(dataItem.createdAt)}</span>

                            {dataItem.updatedAt !== dataItem.createdAt
                             ? <span className="comment-indicator">Edited</span>
                             : <></>
                            }

                            {dataItem.postedBy._id === session.user.id
                              ? <span className="comment-edit-delete">
                                  <span className="comment-delete" onClick={()=>handleDelete(dataItem._id.toString())}>Delete</span>
                                  <span className="comment-edit" onClick={() => startEditing(dataItem)}>Edit</span>
                                </span>
                              : <></>
                            }
                          </span>
                        </div>
                    </div>
           })
        }
      </div>
    </section>
  )
}

export default CommentForm