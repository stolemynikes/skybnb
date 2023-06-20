import React, { useEffect } from 'react'
import { useState } from 'react';
import PhotosUploader from '../PhotosUploader';
import Perks from '../Perks';
import AccountNav from '../AccountNav';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function PlacesFormPage() {

    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const [price, setPrice] = useState(100);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/places/' +id).then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setAddedPhotos(data.photos);
            setPrice(data.price);
        })
    }, [id])

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        )
    }

    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }

    function preInput(header,description) {
        return(
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        )
    }

    async function savePlace(ev) {
        ev.preventDefault();
        const placeData = {
            title, 
            address, 
            addedPhotos, 
            description, 
            perks, 
            extraInfo, 
            checkIn, 
            checkOut, 
            maxGuests,
            price,
        }
        if (id) {
            await axios.put('/places', {
                id, ...placeData
});
            setRedirect(true)
        } else {
            await axios.post('/places', placeData);
            setRedirect(true)
        }
    }

    if (redirect) {
        return <Navigate to={'/account/places'}/>
    }

  return (
    <>
    
    <div>
        <AccountNav/>
            <form onSubmit={savePlace}>
                {/* Title */}
                {preInput('Title', 'Title for your place' )}
                <input type="text" placeholder='Title, for example: My lovely apt'
                    value={title} onChange={ev => setTitle(ev.target.value)} 
                    />

                {/* Address */}
                {preInput('Address', 'Address to your place')}
                <input type="text" placeholder="Address"
                    value={address} onChange={ev => setAddress(ev.target.value)} 
                    />

                {/* Photos */}
                {preInput('Photos', 'Photos of your place')}

                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>


                {/* Description */}
                {preInput('Description', 'Description of the place')}
                <textarea
                value={description} onChange={ev => setDescription(ev.target.value)}
                />

                {/* Perks */}
                {preInput('Perks', 'Select all the perks of your place')}
                <div className='mt-2 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>

                    <Perks selected={perks} onChange={setPerks}/>

                </div>
                
                {/* Extra info */}
                {preInput('Extra info', 'House rules, etc')}
                <textarea
                value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)}
                />

                {/* Check in and out */}
                {preInput('Check in & out times', 'Add the check in & out times')}

                <div className="grid sm:grid-cols-3 gap-2">
                    <div className="mt-2 -mb-1">
                        <h3>Check in time</h3>
                        <input type="text" placeholder="14:00"
                        value={checkIn} onChange={ev => setCheckIn(ev.target.value)}
                        />
                    </div>
                    <div className="mt-2 -mb-1">
                        <h3>Check out time</h3>
                        <input type="text" placeholder="11:00"
                        value={checkOut} onChange={ev => setCheckOut(ev.target.value)}
                        />
                    </div>
                </div>

                {preInput('Guests')}
                <div className="grid sm:grid-cols-3 gap-2">
                    <div className="mt-2 -mb-1">
                        <h3>Max number of guests</h3>
                        <input type="number" placeholder="2"
                        value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)}
                        />
                    </div>
                </div>

                {preInput('Price')}
                <div className="grid sm:grid-cols-3 gap-2">
                    <div className="mt-2 -mb-1">
                        <h3>Price per night</h3>
                        <input type="number" placeholder="'100"
                        value={price} onChange={ev => setPrice(ev.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <button className="primary my-4">Save</button>
                </div>

            </form>
        </div>
            </>
  )
}
