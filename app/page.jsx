"use client";
// This is the home page that is loaded when http://localhost:3000 is called. It is also the page
// that will be loaded as children into the general "layout.jsx" file.

// NOTE: all file names for loading route pages in Next.js must be named with "page.jsx" or "page.tsx".
// NOTE: all file names for API route pages in Next.js must be named with "route.js" or "route.ts".
//       page.jsx and route.js and the corresponding TypeScript version cannot be used in the same folder
// NOTE: all file names for handling page layout in Next.js must be named with "layout.jsx" or "layout.tsx".

import { useRouter } from 'next/navigation';
import Feed from '@components/feed/feed';

function Home() {
  const router = useRouter();

  // The handleHomePostClick() function is passed down from here to the "Feed" component then to the 
  // "PromptCardList" component which is then used on the "public-profile" page.
  const handleHomePostClick = async(postItem) => {
    router.push(`/public-profile?postId=${postItem._id}&quotient=${postItem.creator?.username}&factor=${postItem.creator?.image}`);
  }

  return (
    <section className='mt-[100px] text-center w-full flex flex-col justify-center'>
      <h3 className='text-black dark:text-white font-bold text-5xl w-[90%] max-w-[800px] mx-auto flex flex-col justify-center gap-5'>
          <div>Discover & Explore</div>
          <span className="text-4xl bg-gradient-to-r from-amber-500 via-orange-400 to-orange-800 text-transparent bg-clip-text inline-block">
              Dynamic Text Prompts
          </span>
      </h3>
      <p className="w-[90%] max-w-[800px] mt-10 mx-auto text-center text-gray-600 dark:text-white font-bold">
          A modern social tool for making and sharing creative prompts. <br/> Sign in to get started.
      </p>

      <Feed handleFeedPostClick={handleHomePostClick}/>
    </section>
  )
}

export default Home