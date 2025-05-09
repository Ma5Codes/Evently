import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { BsFillCaretDownFill } from "react-icons/bs";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef();

  // Fetch events from the server
  useEffect(() => {
    axios.get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // Clear search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setSearchQuery("");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const logout = async () => {
    await axios.post("/logout");
    setUser(null);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="flex py-2 px-6 sm:px-6 justify-between items-center">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src="../src/assets/EventHubLogo12.png" alt="EventHub Logo" className="w-26 h-9" />
      </Link>

      {/* Search Bar */}
      <div className="flex bg-white rounded py-2.5 px-4 w-1/3 gap-4 items-center shadow-md shadow-gray-200">
        <button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>
        <div ref={searchInputRef} className="w-full">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="text-sm text-black outline-none w-full"
          />
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {searchQuery && (
        <div className="absolute z-10 p-2 bg-white rounded shadow-md w-144 left-[28.5%] top-14 md:w-[315px] md:left-[17%] md:top-16 lg:w-[540px] lg:left-[12%] lg:top-16">
          {filteredEvents.map((event) => (
            <div key={event._id} className="p-2">
              <Link to={`/event/${event._id}`} className="text-black text-lg w-full">
                {event.title}
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Create Event */}
      <Link to="/createEvent" className="hidden md:flex flex-col items-center py-1 px-2 rounded text-primary hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 transition-shadow duration-1500">
        <svg className="w-5 py-1" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span className="font-bold text-sm">Create Event</span>
      </Link>

      {/* Home */}
      <Link to="/" className="flex flex-col items-center py-1 px-3 rounded hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 transition-shadow duration-1500">
        <svg className="w-5 py-1" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4.5l9 5.25M4.5 10.5v9h3.75v-6h6v6h3.75v-9" />
        </svg>
        <span>Home</span>
      </Link>

      {/* Desktop Nav Items */}
      <div className="hidden lg:flex gap-5 text-sm">
        <NavIconLink to="/wallet" label="Wallet" iconPath="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
        <NavIconLink to="/dashboard" label="Dashboard" iconPath="M3 3h7.5v7.5H3V3zM13.5 3H21v4.5h-7.5V3zM3 13.5h7.5V21H3v-7.5zM13.5 12H21v9h-7.5v-9z" />
        <NavIconLink to="/calendar" label="Calendar" iconPath="M6 2v2M18 2v2M3 7h18M5 11h14v10H5z" />
      </div>

      {/* Bell Icon */}
      <div className="flex flex-col items-center py-1 px-3 rounded hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 transition-shadow duration-1500">
        <svg className="w-6 py-1" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Auth Section */}
      {user ? (
        <div className="flex items-center gap-2 sm:gap-8">
          <div className="relative flex items-center gap-2">
          <Link to="/useraccount" className="flex items-center gap-2">
            <img
            src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
            alt="User Avatar"
            className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"/>
            <span className="font-semibold uppercase">{user.name}</span>
          </Link>

            <BsFillCaretDownFill
              className="h-5 w-5 cursor-pointer hover:rotate-180 transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
           {isMenuOpen && (
            <div className="absolute top-12 right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-fadeIn">
           <Link to="/" className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-800">🏠 Home</Link>
           <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-800">📊 Dashboard</Link>
           <Link to="/wallet" className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-800">💼 Wallet</Link>
           <Link to="/calendar" className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-800">📅 Calendar</Link>
           <hr className="my-1 border-gray-200" />
            <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
             >
            🚪 Log out
          </button>
          </div>
          )}

        </div>
        </div>
      ) : (
        <Link to="/login">
          <button className="primary">Sign in</button>
        </Link>
      )}
    </header>
  );
}

// 🔁 Reusable Nav Icon Link Component
function NavIconLink({ to, label, iconPath }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center py-1 px-3 rounded hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 transition-shadow duration-1500"
    >
      <svg
        className="w-5 py-1"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
      </svg>
      <span>{label}</span>
    </Link>
  );
}

// import { useContext, useEffect, useRef, useState } from "react";
// import axios from 'axios'
// import {Link} from "react-router-dom";
// import { UserContext } from "../UserContext";
// import { RxExit } from 'react-icons/rx';
// import { BsFillCaretDownFill } from 'react-icons/bs';


// export default function Header() {
//   const {user,setUser} = useContext(UserContext);
//   const [isMenuOpen, setisMenuOpen] = useState(false);
//   const [events, setEvents] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const searchInputRef = useRef();

//   //! Fetch events from the server -------------------------------------------------
//   useEffect(() => {
    
//     axios.get("/events").then((response) => {
//       setEvents(response.data);
//     }).catch((error) => {
//       console.error("Error fetching events:", error);
//     });
//   }, []);


//   //! Search bar functionality----------------------------------------------------
//   useEffect(() => {
//     const handleDocumentClick = (event) => {
//       // Check if the clicked element is the search input or its descendant
//       if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
//         setSearchQuery("");
//       }
//     };

//     // Listen for click events on the entire document
//     document.addEventListener("click", handleDocumentClick);

//     return () => {
//       document.removeEventListener("click", handleDocumentClick);
//     };
//   }, []); 
  
//   //! Logout Function --------------------------------------------------------
//   async function logout(){
//     await axios.post('/logout');
//     setUser(null);
//   }
// //! Search input ----------------------------------------------------------------
//   const handleSearchInputChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

  

//   return (
//     <div>
//       <header className='flex py-2 px-6 sm:px-6 justify-between place-items-center '>
          
//           <Link to={'/'} className="flex item-center ">
//             <img src="../src/assets/EventHubLogo12.png" alt="" className='w-26 h-9'/>
//           </Link>

        

//           <div  className='flex bg-white rounded py-2.5 px-4 w-1/3 gap-4 items-center shadow-md shadow-gray-200'>
            
//             <button>
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
//               </svg>
//             </button>
//             <div ref={searchInputRef}>
//               <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearchInputChange} className='text-sm text-black outline-none w-full '/>
//             </div>
//             {/* <div className='text-sm text-gray-300 font-semibold'>Search</div> */}      
//           </div> 

//           {/*------------------------- Search Functionality -------------------  */}
//           {searchQuery && (
//           <div className="p-2 w-144 z-10 absolute rounded left-[28.5%] top-14 md:w-[315px] md:left-[17%] md:top-16 lg:w-[540px] lg:left-[12%] lg:top-16 bg-white">
//             {/* Filter events based on the search query */}
//             {events
//               .filter((event) =>
//                 event.title.toLowerCase().includes(searchQuery.toLowerCase())
//               )
//               .map((event) => (
//                 <div key={event._id} className="p-2">
//                   {/* Display event details */}
//                   <Link to={"/event/" + event._id}>
//                       <div className="text-black text-lg w-full">{event.title}</div>
//                   </Link>
//                 </div>
//               ))}
//           </div>
//           )}
    
          
//           <Link to={'/createEvent'}> {/*TODO:Route create event page after creating it */}
//             <div className='hidden md:flex flex-col place-items-center py-1 px-2 rounded text-primary cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500'>
//               <button>
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 stroke-3 py-1">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//                 </svg>
//               </button>
//               <div className='font-bold color-primary text-sm'>Create Event</div>
//             </div>  
//           </Link>

//           <Link to={'/'}>
//             <div className='flex flex-col place-items-center py-1 px-3 rounded cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500'>
//              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 py-1">
//                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4.5l9 5.25M4.5 10.5v9a.75.75 0 00.75.75H9v-6h6v6h3.75a.75.75 0 00.75-.75v-9" />
//              </svg>
//              <div>Home</div>
//             </div>
//           </Link>


//           <div className='hidden lg:flex gap-5 text-sm'>
//           <Link to={'/wallet'}> {/*TODO:Route wallet page after creating it */}
//             <div className='flex flex-col place-items-center py-1 px-3 rounded cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500'>
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 py-1">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
//                 </svg>
//                 <div>Wallet</div>
//             </div >
//             </Link>

//             <Link to={'/dashboard'}>
//               <div className='flex flex-col place-items-center py-1 px-3 rounded cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500'>
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 py-1">
//                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h7.5v7.5H3V3zM13.5 3H21v4.5h-7.5V3zM3 13.5h7.5V21H3v-7.5zM13.5 12H21v9h-7.5v-9z" />
//                  </svg>
//                  <div>Dashboard</div>
//               </div>
//             </Link>


            

//             <Link to={'/calendar'}> {/*TODO:Route calendar page after creating it */}
//             <div className='flex flex-col place-items-center py-1 px-3 rounded cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500'>
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 py-1">
//                 <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
//                 <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
//               </svg>
//               <div>Calendar</div>
//             </div>
//             </Link>
//           </div>
          

//           <div>
//             <div className='flex flex-col place-items-center py-1 px-3 rounded cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500'>
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 py-1">
//                 <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd" />
//               </svg>
          
//             </div>
//           </div>

//         {/* -------------------IF user is Logged DO this Main-------------------- */}
//         {!!user &&(
          
//           <div className="flex flex-row items-center gap-2 sm:gap-8 ">
//             <div className="flex items-center gap-2">
//               <Link to={'/useraccount'}>  {/*TODO: Route user profile page after creating it -> 1.50*/} 
//                 {user.name.toUpperCase()}
//               </Link>
              
//               <BsFillCaretDownFill className="h-5 w-5 cursor-pointer hover:rotate-180 transition-all" onClick={() => setisMenuOpen(!isMenuOpen)}/>
//             </div>
//             <div className="hidden md:flex">
//               <button onClick={logout} className="secondary">
//                 <div>Log out</div>
//                 <RxExit/>
//               </button>
//             </div>
//           </div>  
//         )}

//         {/* -------------------IF user is not Logged in DO this MAIN AND MOBILE-------------------- */}
//         {!user &&(
//           <div>
            
//             <Link to={'/login'} className=" ">
//               <button className="primary">
//                 <div>Sign in </div>
//               </button>
//             </Link>
//           </div>
//         )}
          
//           {/* -------------------IF user is Logged DO this Mobile -------------------- */}
//           {!!user &&(
//             //w-auto flex flex-col absolute bg-white pl-2 pr-6 py-5 gap-4 rounded-xl
//             <div className="absolute z-10 mt-64 flex flex-col w-48 bg-white right-2 md:right-[160px] rounded-lg shadow-lg"> 
//             {/* TODO: */}
//               <nav className={`block ${isMenuOpen ? 'block' : 'hidden'} `}>
//                 <div className="flex flex-col font-semibold text-[16px]">
//                 <Link className="flex hover:bg-background hover:shadow py-2 pt-3 pl-6 pr-8 rounded-lg" to={'/createEvent'} >
//                   Create Event
//                 </Link>
                
//                 <Link className="flex hover:bg-background hover:shadow py-2 pl-6 pr-8 rounded-lg" to={'/wallet'}>
//                   <div>Wallet</div>
//                 </Link>
                
//                 <Link className="flex hover:bg-background hover:shadow py-2 pl-6 pr-8 rounded-lg" to={'/dashboard'}>
//                  <div>Dashboard</div>
//                 </Link>

                

//                 <Link className="flex hover:bg-background hover:shadow py-2 pl-6 pr-8 rounded-lg" to={'/calendar'}>
//                   <div>Calendar</div>
//                 </Link>

//                 <Link className="flex hover:bg-background hover:shadow py-2 pl-6 pb-3 pr-8 rounded-lg" onClick={logout}>
//                   Log out
//                 </Link>
//                 </div>
//               </nav>
//             </div>
//         )}

//         </header>
          
//     </div>
//   )
// }
