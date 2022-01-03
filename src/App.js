import '../src/sass/style.scss';
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import MainNavigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import { AccessProvider } from "./context/AccessContext";
import { Container } from "react-bootstrap";
import Home from "./components/home/Home"
import EnquiryForm from "./components/enquiry/EnquiryForm";
import Contact from "./components/contact/Contact";
import Booking from "./components/booking/BookingPage";
import BookingRegister from "./components/booking/BookingRegister";
import EstablishmentList from "./components/accommodation/EstablishmentFullList";
import RenderEstablishmentByType from "./components/accommodation/EstablishmentByType";
import EstablishmentDetails from "./components/accommodation/EstablishmentDetails";
import CreateEstablishment from "./components/admin/EstablishmentCreation";
import RoomDetails from "./components/accommodation/room/RoomDetails";
import AdminPage from "./components/admin/AdminPage";
import EnquiryBoard from "./components/admin/EnquiryBoard";
import EnquiryDetail from "./components/enquiry/EnquiryDetail";
import MessageBoard from "./components/admin/MessageBoard";
import MessageDetail from "./components/contact/ContactMsgDetail";
import RegisterUser from "./components/access/register/RegisterPage";

function App() {

    const [booking, setBooking] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("holidaze-booking")) ?? [];
        } catch {
            console.error("There was an error during booking. Please try again.");
            return [];
        }
    });

    useEffect(() => localStorage.setItem("holidaze-booking", JSON.stringify(booking)), [booking]);

    function addBooking(bookingId, roomId, roomName, roomPrice, slug, roomSlug, guests, startDate, endDate) {
        setBooking((bookings) => {
            return [...bookings, { bookingId, roomId, roomName, roomPrice, slug, roomSlug, guests, startDate, endDate }];

        });
    } 

    function removeBooking(generatedBookingId) {
        setBooking((bookings) => {
            const confirmDelete = window.confirm("Are you sure you want to remove this room?");
            const bookingIndex = bookings.findIndex((booking) => booking.bookingId === generatedBookingId);

            if (bookingIndex >= 0 && confirmDelete) {
                bookings.splice(bookingIndex, 1);
                localStorage.setItem("holidaze-booking", JSON.stringify([...bookings]));
            }

            return [ ...bookings ];
        }); 
    }

    function clearBookings() {
        setBooking([]);
    }

    return (
        <AccessProvider>
            <main className="main">
                <MainNavigation />
                <Container fluid className="main__container">
                    <Routes>
                        <Route path="/" exact element={<Home />}></Route>
                        <Route path="/accommodation/" exact element={<EstablishmentList/>}></Route>
                        <Route path="/accommodation/:type" element={<RenderEstablishmentByType/>}></Route>
                        <Route path="/accommodation/:type/:slug/" exact element={<EstablishmentDetails/>}></Route>
                        <Route path="/accommodation/:type/:slug/room/:roomSlug" element={<RoomDetails addBooking={addBooking}/>}></Route>
                        <Route path="/enquiry" element={<EnquiryForm/>}></Route>
                        <Route path="/contact-us" element={<Contact/>}></Route>
                        <Route path="/admin" exact element={<AdminPage/>}></Route>  
                        <Route path="/admin/message-board" element={<MessageBoard/>}></Route>  
                        <Route path="/admin/message-board/message/:id" element={<MessageDetail/>}></Route> 
                        <Route path="/admin/enquiries" element={<EnquiryBoard/>}></Route>  
                        <Route path="/admin/enquiries/enquiry/:id" element={<EnquiryDetail/>}></Route>  
                        <Route path="/admin/create-establishment" element={<CreateEstablishment/>}></Route>   
                        <Route path="/register" element={<RegisterUser/>}></Route> 
                        <Route path="/book-accommodations" exact element={<Booking booking={booking} removeBooking={removeBooking}/>}></Route>
                        <Route path="/book-accommodations/reservation" element={<BookingRegister booking={booking} clearBookings={clearBookings}/>}></Route>
                    </Routes>
                    <Footer/>
                </Container>
            </main>
        </AccessProvider>
    );
}

export default App;
