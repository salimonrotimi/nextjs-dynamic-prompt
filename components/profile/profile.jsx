"use client";

import "./profile.css";
import Image from "next/image";
import { useState } from "react";
import PromptCard from "@components/prompt-card/prompt-card";
import ImageModal from "@components/profile-image-modal/image-modal";


function Profile(props) {
  // The values of name, description, data, handleEditClick, handleDeleteClick are passed down from the
  // "profile" page in "app/profile" path
  const {name, profileImage, description, recent, data, handleEditClick, handleDeleteClick} = props // destructure the "props" object.
  const [isModalOpen, setIsModalOpen] = useState(false)

  // open modal and close modal function
  const openModal = () => {
    setIsModalOpen(true);   // "isModalOpen" becomes "true" here.
  }
  const closeModal = () => {
    setIsModalOpen(false);  // // "isModalOpen" is set back to "false" here.
  }
  return (
    <section className="profile">
      <p className="profile-description">{description}</p>

      <div className="profile-image-container"  onClick={openModal}>
        <Image 
          src={profileImage ? profileImage : null} 
          alt="Profile image" 
          width={50} 
          height={50} 
          className="profile-image"
        />

        {/* Profile overlay shadow when image is hovered on */}
        <div className="profile-overlay">
          <svg 
            className="profile-expand-icon"
            width="24" 
            height="24" 
            fill="white"             
            viewBox="0 0 24 24"
          >
            <path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3h-6zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3v6zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6h6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6v-6z"/>
          </svg>
        </div>

        {/* Image Modal */}
        <ImageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          imageUrl={profileImage}
          username={name}
        />
      </div>

      <h1>{name}</h1>

      <p className="profile-recent">{recent}</p>

      <div className='promptcard-list'>
        {data &&  data.map((dataItem, index)=>{
          return <PromptCard
                    key={index}
                    post={dataItem}
                    handleEdit={() => handleEditClick ? handleEditClick(dataItem) : null}
                    handleDelete={() => handleDeleteClick && handleDeleteClick(dataItem)}
                  />
        })}
      </div>
    </section>
  )
}

export default Profile