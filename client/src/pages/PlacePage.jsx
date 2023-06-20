import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

export default function PlacePage() {
    
    const [place, setPlace] = useState(null)

    const {id} = useParams();

    useEffect(() => {
        if(!id) {
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data);
        })
    },[id])

    if (!place) return '';


  return (
    <div className="mt-6 border-t-[1px] border-black -mx-8 p-8 flex flex-col content-center flex-wrap ">
        <div className="lg:w-[50%] sm:w-[80%] w-[80%]">

        <h1 className="text-3xl font-semibold">{place.title}</h1>

            <AddressLink>{place.address}</AddressLink>

            <PlaceGallery place={place}/>


        <div className="grid grid-cols-[60%_40%] my-12 gap-8">

            <div className="">
                <div className="border-b-[1px] border-gray-400 pb-10">
                    <h2 className="font-semibold text-2xl my-2">Description</h2>
                    {place.description}
                </div>

                <div className="my-12 border-b-[1px] border-gray-400 pb-10">
                    <h2 className="font-semibold text-2xl my-2">Check in & out times and max guests</h2>
                    <p>Check-in: {place.checkIn}:00</p>
                    <p>Check-out: {place.checkOut}:00</p>
                    <p>Max number of guests: {place.maxGuests}</p>
                </div>

                <div className="my-12 border-b-[1px] border-gray-400 pb-10">
                    <h2 className="font-semibold text-2xl my-2">Extra Info</h2>
                    <div>{place.extraInfo}</div>
                </div>

            </div>
            
                    <BookingWidget place={place}/>
            
            </div>

        </div>


    </div>
  )
}
