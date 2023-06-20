import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IndexPage() {

    const [places, setPlaces] = useState([])

    useEffect(() => {
        axios.get('/places').then(response => {
            setPlaces(response.data)
        })
    }, [])
    
    return (
        <div className="mt-8 gap-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {places.length > 0 && places.map(place => (
                <Link to={'/place/' + place._id} className='cursor-pointer' key={place._id}>
                    <div className="bg-gray-500 rounded-2xl flex mb-2">
                        {place.photos?.[0] && (
                            <img key={place.photo} className="rounded-2xl object-cover aspect-square" src={'https://api.pepijnscheer.nl/uploads/' + place.photos?.[0]} alt={place.title}/>
                        )}
                    </div>
                    <h2 className="font-bold">{place.address}</h2>
                    <h3 className="text-sm text-gray-500 truncate">{place.title}</h3>
                    <div className="mt-2">
                        <span className="font-bold">${place.price}</span> per night
                    </div>
                </Link>
            ))}
        </div>
    )
}