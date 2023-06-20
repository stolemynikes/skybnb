import React from 'react'
import { useState } from 'react';

export default function PlaceGallery({place}) {

    const [showAllPhotos, setShowAllPhotos] = useState(false);
   
    if(showAllPhotos) {
        return(
            <div className="absolute inset-0 bg-white min-h-screen z-20">
                <div className="p-8 grid gap-4">
                    <div className="mt-20 font-semibold">
                        {/* <h2 className="text-3xl justify-center flex">Photos of {place.title}</h2> */}
                        <button onClick={() => setShowAllPhotos(false)} className=" fixed bg-transparent border-solid border-white left-8 top-8 flex gap-2 py-2 px-4 rounded-xl ">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                            </svg>
                        Close photos
                        </button>
                    </div>
                    {place?.photos?.length > 0 && place.photos.map(photo => (
                        <div className="flex justify-center">
                            <img className="w-[80%] md:w-1/2 object-cover" src={'https://api.pepijnscheer.nl/uploads/' + photo} alt="" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

  return (
    <div className="relative">

    <div className="grid gap-2 grid-cols-[2fr_1fr] h-[50%]">
        <div>{place.photos?.[0] && (
            
            <div className="">
                <img onClick={() => setShowAllPhotos(true)} className="hover:opacity-80 aspect-square object-cover rounded-l-xl w-[100%] h-[100%]" src={'https://api.pepijnscheer.nl/uploads/' + place.photos?.[0]} alt="" />
            </div>

        )}</div>

        <div className="gap-2">
            {place.photos?.[1] && (
            <img onClick={() => setShowAllPhotos(true)} className="hover:opacity-80 aspect-square object-cover rounded-tr-xl w-[100%] h-[50%]" src={'https://api.pepijnscheer.nl/uploads/' + place.photos?.[1]} alt="" />
            )}
            {place.photos?.[2] && (

                <div className="overflow-hidden rounded-br-xl">
                    <img onClick={() => setShowAllPhotos(true)} className="hover:opacity-80 relative top-2 aspect-square object-cover w-[100%] h-[50%]" src={'https://api.pepijnscheer.nl/uploads/' + place.photos?.[2]} alt="" />
                </div>

            )}
        </div>

    </div>

    <button onClick={() => setShowAllPhotos(true)}className="flex gap-2 absolute bottom-2 right-2 py-1 px-4 bg-white border-solid border-[1px] border-black rounded-lg shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
        </svg>
    Show all photos
    </button>

    </div>
  )
}
