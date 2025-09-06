"use client";

import './prompt-card.css'
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

function PromptCard(props) {
  // The values of post, handleTag are passed down from the "PromptCardList" component in "component/feed" 
  // path. That of handleEdit, handleDelete are passed down from the "profile" page in app/profile path.
  const {post, handlePost, handleEdit, handleDelete} = props   // destructure the "props" object.
  // handleEdit, handleDelete are newly added, they are not part of the "props" initially
  const [copied, setCopied] = useState('');
  const pathname = usePathname();
  const {data: session} = useSession();      //destructure "data" and rename to session

  const handleCopy = (e) => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);   // "navigator" is a default "window" method
    toast.success("Prompt copied to clipboard.");    
    setTimeout(()=>setCopied(''), 3000); // changes "copied" back to '' after 3 secs, which changes the image    
  }

  // the "dangerouslySetInnerHTML={{__html: post.prompt}}" makes it possible to run html tags in the post.
  return (
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
        ? <div className='prompt-card-edit-delete'>
            <div className='prompt-card-edit' onClick={handleEdit}>
              <Image src={"/assets/images/edit-icon.png"} alt='Edit post' width={18} height={18}/>
              <p>Edit</p>
            </div>
            <div className='prompt-card-delete' onClick={handleDelete}>
              <Image src={"/assets/images/delete-icon.png"} alt='Delete post' width={25} height={25}/>
              <p>Delete</p>
            </div>
          </div>
        : <></>
      }     
    </div>
  )
}

export default PromptCard