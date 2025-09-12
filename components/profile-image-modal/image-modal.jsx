'use client';

import "./image-modal.css";
import { useEffect } from 'react'
import Image from 'next/image'

export default function ImageModal(props) {
  const { isOpen, onClose, imageUrl, username } = props; // destructuring of the props object.

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>        
        <button onClick={onClose} className="modal-close-btn">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="modal-image-container">
          <Image
            src={imageUrl}
            alt={`${username}'s profile picture`}
            width={600}
            height={600}
            className="modal-image"
            priority
          />
          
          <div className="modal-user-label">{username}</div>
        </div>
      </div>
    </div>
  )
}