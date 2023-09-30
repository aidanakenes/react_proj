import React from 'react';
import { useState } from 'react';
import Moment from 'moment';

import './AirTicketsBooking.css'

import search_icon from '../Assets/search.png'
import plane_icon from '../Assets/plane.png'
import baggage_icon from '../Assets/baggage.png'


const AirTicketsBooking = () => {
    const [searchDataResponse, setData] = useState([]);
    const [detailsDataResponse, setDetailsData] = useState({});
    const [bookingDataResponse, setBookingData] = useState({});
    const [isShown, setIsShown] = useState(false);
    const [isBookingShown, setIsBookingShown] = useState(false);

    const search = async () => {
        const origin = document.getElementsByClassName("origin");
        const destination = document.getElementsByClassName("destination");
        const originDate = document.getElementsByClassName("origin-date");
        const destinationDate = document.getElementsByClassName("destination-date");
        const adult = document.getElementsByClassName("adult");
        const child = document.getElementsByClassName("child");
        const infant = document.getElementsByClassName("infant");
        const class_ = document.getElementsByClassName("class");
        const currency = document.getElementsByClassName("currency");

        let url = "http://localhost:8000/search"
        let resp = await fetch(url, {
            method: 'POST',
            // mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                provider: "Amadeus",
                cabin: class_[0].value || "Economy",
                origin: origin[0].value,
                destination: destination[0].value,
                dep_at: originDate[0].value,
                arr_at: destinationDate[0].value,
                adults: parseInt(adult[0].value || '1'),
                children: parseInt(child[0].value  || '0'),
                infants: parseInt(infant[0].value || '0'),
                currency: currency[0].value || 'KZT',
            })
        });
        let data = await resp.json();

        let searchResponse = await fetch(`${url}/${data.search_id}`, {method: "GET"});
        let searchData = await searchResponse.json();
        console.log(searchData.items);
        
        setData(searchData.items);
    }

    const details = async (offerId) => {
        let url = "http://localhost:8000/offers"

        if (isShown){
            setIsShown(false)
        } else{

            const baggage = document.getElementsByClassName("bag");
            baggage.innerHTML = "2";
            console.log("??????????????????????????????");
            console.log(document.getElementsByClassName("bag"));

            let detailsResponse = await fetch(`${url}/${offerId}`, {method: "GET"});
            let detailsData = await detailsResponse.json();
            console.log(detailsData.flights);
            setDetailsData(detailsData);

            setIsShown(true);
        }
    }

    const book = async (offerId) => {
        const phone = document.getElementsByClassName("phone");
        const email = document.getElementsByClassName("email");
        const gender = document.getElementsByClassName("gender");
        const firstName = document.getElementsByClassName("firstName");
        const lastName = document.getElementsByClassName("lastName");
        const docNum = document.getElementsByClassName("docNum");
        const dob = document.getElementsByClassName("dob");

    
        let url = "http://localhost:8000/booking"
        let resp = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                offer_id: offerId,
                phone: phone[0].value,
                email: email[0].value,
                passengers: [{
                    gender:gender[0].value,
                    type: "ADT",
                    first_name: firstName[0].value,
                    last_name: lastName[0].value,
                    date_of_birth: dob[0].value,
                    citizenship: "KZ",
                    document: {
                        number: docNum[0].value,
                        expirest_at: "2025-08-24",
                        iin: "123456789123"
                    }
                }]
            })
        });
        let data = await resp.json();
        console.log(data);

        if (isBookingShown){
            setIsBookingShown(false)
        } else{
            setBookingData(data);
            setIsBookingShown(true);
        }
    }

    return (
        <div className='container'>
            <div className='booking'>
                {isBookingShown && (
                    <div className='bookingInfo'>
                        
                        <div>Your booking info</div>
                        <div className='bookBox'>
                            <div className='pnr'>{bookingDataResponse.pnr}</div>
                            <div className='expiresAt'>{Moment(bookingDataResponse.expires_at).format('d MMM, HH:mm')}</div>
                        </div>
                        <div className='bookBox'>
                            <div className='innerBox'>
                                <div className='contactText'>Contact phone:</div>
                                <div className='contactText'>Contact email:</div>
                            </div>
                            <div className='innerBox'>
                                <div className='contactData'>{bookingDataResponse.phone}</div>
                                <div className='contactData'>{bookingDataResponse.email}</div>
                            </div>
                        </div>

                        <div className='pnr'>Passengers: </div>
                        <div className='passengers'>
                            {bookingDataResponse.passengers.map(passenger => {
                                return (  
                                    <div className='passenger'>
                                        <div className='pasName'><text>name:</text> {passenger.first_name} {passenger.last_name}</div>
                                        <div className='pasDoc'><text>birthday:</text> {passenger.date_of_birth}</div>
                                        <div className='pasDoc'><text>document:</text> {passenger.document.number}</div>
                                    </div>
                                )
                            })}
                        </div>


                        {bookingDataResponse.offer.flights.map(flight => {
                            return (
                                <div>
                                    {flight.segments.map(segment => {
                                        return(
                                            <div className='flight'>
                                                <div className="detailsRoute">{segment.dep.airport.name} - {segment.arr.airport.name} </div>
                                                <div className='box'>
                                                    <div className='airlineName'>{segment.operating_airline}</div>
                                                    <div className='flightNum'>{segment.operating_airline}-{segment.flight_number}</div>
                                                </div>

                                                <div className='box'>
                                                    <div className='dates'>
                                                        <div className='detailsOriginTime'>{Moment(segment.dep.at).format('HH:mm')}</div>
                                                        <div className='detailsOriginDate'>{Moment(segment.dep.at).format('d MMM')}</div>
                                                    </div>
                                                    <div className='detailsOrigin'>{segment.dep.airport.code}</div>
                                                </div>
                                                
                                                <div className='box'>
                                                    <div className='dates'>
                                                        <div className='detailsDestinationTime'>{Moment(segment.arr.at).format('HH:mm')}</div>
                                                        <div className='detailsDestinationDate'>{Moment(segment.arr.at).format('d MMM')}</div>
                                                    </div>
                                                    <div className='detailsDestination'>{segment.arr.airport.code}</div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                
                            )
                        })}
                        <div className='baggage'><img className='baggageIcon' src={baggage_icon}/><div>1PC</div></div>
                    
            
                    </div>
                    
                )}
            </div>

            <div className='search'>
                <div className='top-bar'>
                    <input type="text" className="origin" placeholder='   From'/>
                    <input type="text" className="destination" placeholder='    To'/>
                    <input type="date" className="origin-date" placeholder='From Date' required pattern="\d{4}-\d{2}-\d{2}"/>
                    <input type="date" className="destination-date" placeholder='To Date' required pattern="\d{4}-\d{2}-\d{2}"/>
                    <input type="number" className="adult" placeholder='ADT' min="1" max="3"/>
                    <input type="number" className="child" placeholder='CHD' min="0" max="3"/>
                    <input type="number" className="infant" placeholder='INF' min="0" max="3"/>
                    <input type="text" className="currency" placeholder='KZT'/>
                    <select className='class'>
                        <option value='Economy'>Economy</option>
                        <option value='Business'>Business</option>
                    </select>
                    <div className='search-icon' onClick={()=>{search()}}>
                        <img src={search_icon}/>
                    </div>
                </div>
                <img className='plane-image' src={plane_icon}/>
                {searchDataResponse?.map(item => {
                    return (          
                        
                        <div className="offer">
                            <div className="airline-data">{item.airline.name}</div>
                            {item.flights.map(flight => {
                                return (
                                    <div>
                                        <div>
                                            <div className="origin-time-data">{Moment(flight.segments[0].dep.at).format('HH:mm')}</div>
                                            <div className="origin-date-data">{Moment(flight.segments[0].dep.at).format('d MMM')}</div>
                                            <div className="origin-data">{flight.segments[0].dep.airport.name}</div>
                                        </div>
                                        <div>
                                            <div className="destination-time-data">{Moment(flight.segments.at(-1).arr.at).format('HH:mm')}</div>
                                            <div className="destination-date-data">{Moment(flight.segments.at(-1).arr.at).format('d MMM')}</div>
                                            <div className="destination-data">{flight.segments.at(-1).arr.airport.name}</div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="class-data"><text>{item.cabin} cabin</text></div>
                            <div className='searchDetails'><button className="detailsBtn" onClick={()=>{details(item.id)}}>{item.price.amount} {item.price.currency}</button></div>
                        </div>   
                    );
                })
                }
            </div>

            <div className='details'>

                {isShown && (

                <div className='right-bar'>
                    {detailsDataResponse.flights.map(flight => {
                        return (
                            <div>
                                {flight.segments.map(segment => {
                                    return(
                                        <div className='flight'>
                                            <div className="detailsRoute">{segment.dep.airport.name} - {segment.arr.airport.name} </div>
                                            <div className='box'>
                                                <div className='airlineName'>{segment.operating_airline}</div>
                                                <div className='flightNum'>{segment.operating_airline}-{segment.flight_number}</div>
                                            </div>

                                            <div className='box'>
                                                <div className='dates'>
                                                    <div className='detailsOriginTime'>{Moment(segment.dep.at).format('HH:mm')}</div>
                                                    <div className='detailsOriginDate'>{Moment(segment.dep.at).format('d MMM')}</div>
                                                </div>
                                                <div className='detailsOrigin'>{segment.dep.airport.code}</div>
                                            </div>
                                            
                                            <div className='box'>
                                                <div className='dates'>
                                                    <div className='detailsDestinationTime'>{Moment(segment.arr.at).format('HH:mm')}</div>
                                                    <div className='detailsDestinationDate'>{Moment(segment.arr.at).format('d MMM')}</div>
                                                </div>
                                                <div className='detailsDestination'>{segment.arr.airport.code}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            
                        )
                    })}

                    <div className='baggage'><img className='baggageIcon' src={baggage_icon}/><div>1PC</div></div>
                    
                    <div className='bookForm'>
                        <div className="detailsRoute">Contact info: </div>
                        <div>
                            <input type="text" className="phone" placeholder='Phone'/>
                            <input type="text" className="email" placeholder='Email'/>
                        </div>
                        <div className="detailsRoute">Passenger info: </div>
                        <div>
                            <input type="text" className="firstName" placeholder='First name'/>
                            <input type="text" className="lastName" placeholder='Last name'/>
                        </div>
                        <div>
                            <input type="text" className="gender" placeholder='Gender'/>
                            <input type="date" className="dob" placeholder='Date of birth' required pattern="\d{4}-\d{2}-\d{2}"/>
                        </div>
                        <div>
                            <input type="text" className="docNum" placeholder='Document number'/>
                        </div>
                    </div>

                    <button className='book' onClick={()=>{book(detailsDataResponse.id)}}>Book this flight</button>
                </div>                    
                )}
            </div>
        </div>
    )
}
  
export default AirTicketsBooking
