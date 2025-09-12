"use client";

import "./form-component.css";
import Link from 'next/link';
import { useState } from 'react';

function FormComponent(props) {
  // "props" refers to all the properties that are added to the <Form /> tag anywhere it is called

  const {type, post, setPost, submitting, handleSubmit} = props;    // destructuring the "props" object
  const [isValidated, setIsValidated] = useState(submitting); // "submitting" is passed to the "Form" as false

  const cancelForm = () => {
    setPost({
      prompt: "",
      tag: "",
    });
  }

  const handleChecked = (e) => {
    setIsValidated((prevState)=>(!prevState));    // "prevState" refers to the "isValidated" variable
  }

  const handleChange = (event) => {
    const {name, value} = event.target;
    setPost({...post, [name]: value});
  }
  
  return (
    <section className='form-section'>
      <h1 className='form-header'>
        <span className='form-header-span'>{type} Post</span>
      </h1>

      <p className='form-paragraph'>
        {type} and share amazing prompts with the world, and see the excitement and beauty of dynamic prompts.
      </p>

      <form onSubmit={handleSubmit} className='submit-form'>
        <label>
          <span className='form-label-span'>Your Unique Prompt</span>

          <span className="textarea-character-count">{post.prompt.length}/200</span>
          <textarea
            className='form-textarea'
            value={post.prompt}
            name='prompt'
            onChange={handleChange}
            placeholder='Write your prompt here...'
            maxLength={200}
            required
          />
        </label>
        <label className='form-input-label'>
          <span className='form-label-span'>
            Tag <span>(#tech #idea #innovation)</span>
          </span>

          <input
            className='form-input'
            value={post.tag}
            name='tag'
            onChange={handleChange}
            placeholder='Add #tag'
            required
          />
        </label>

        <div className='form-div-validate'>
          <input type='checkbox' className='form-checkbox' onChange={handleChecked} checked={isValidated}/>
          <span className='form-label-span'>I have confirmed that my inputs are correct.</span>
        </div>

        <div className='form-div-submit'>
          <Link href="/create-prompt" className='form-cancel' onClick={cancelForm}>
            Cancel
          </Link>

          <button type='submit' className='form-btn' disabled={!isValidated}>
            {isValidated ? `${type}...` : type}
          </button>
        </div>        
      </form>
    </section>
  )
}

export default FormComponent