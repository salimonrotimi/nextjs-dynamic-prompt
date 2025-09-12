"use client"       // This must be added whenever a react hooks (such as useState, useEffect, etc) is used

import "./navbar.css";
import React from 'react';   // The "React" import is optional in nextjs
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import {signIn, signOut, useSession} from 'next-auth/react';


function Nav() {
    const {data: session} = useSession(); // aliasing or renaming "data" to "session". 
    // session.user is used below to find out if a user exist in the session
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = (e) => {
        if(menuRef.current){
            setIsOpen(!isOpen);
            menuRef.current.classList.toggle("navbar-logout-toggle");   // shows the menu content
            setTimeout(()=>{
                setIsOpen(false);
                menuRef.current.classList.toggle("navbar-logout-toggle");   // hides the menu content again.
            }, 5000); // changes "isOpened" back to 'false' after 5 secs, which hides the menu 
        }
    }
    
    return (
        <nav className="navbar">
            <Link href="/" className="navbar-logo">
                <Image src="/assets/images/home.png" alt="AI prompt" className="navbar-image" width="30" height="30"/>
                <p>{pathname !== "/" ? <span style={{color:"#2856A1FF"}}>Go Home</span> : "Tecnic"}</p>
            </Link>

            <div className="navbar-login-logout">
                {session?.user 
                 ?  (
                        <>
                            <Image 
                                src={isOpen ? "/assets/images/menu-close.png" : "/assets/images/menu.png"}
                                alt="Menu icon"
                                width={30}
                                height={30}
                                className="navbar-menu-icon"
                                onClick={toggleMenu}
                            />
                            <div className="navbar-logout" ref={menuRef}>                                
                                <button type="button" onClick={()=>signOut()} className="logout">
                                    Sign Out
                                </button>
                                {pathname !== "/create-prompt"
                                 ? <Link href="/create-prompt" className="create-post">
                                     Create Post
                                   </Link>
                                 : <></>
                                }
                                {pathname !== "/profile"
                                 ? <Link href="/profile" className="navbar-user-profile">
                                        <p>My Profile</p>
                                        <Image 
                                            src={session.user.image} 
                                            width={27} height={27} 
                                            alt="User profile icon"
                                            className="navbar-profile-image" 
                                        />
                                   </Link>
                                 : <></>
                                }
                            </div>
                        </>
                    ) : (   
                            <>             
                               <div className="navbar-home-login">
                                    {pathname !== "/"
                                    ? <span className="home-link">
                                            <Link href="/">Back to Home</Link>
                                      </span>
                                    : <></>
                                    }

                                    {pathname !== "/login"         
                                    ? <span className="login">
                                        <Link href="/login">Sign In</Link>
                                      </span>
                                    : <></>
                                    } 
                                </div>                         
                            </>
                        )  
                } 
            </div>            
        </nav>
    )
}

export default Nav