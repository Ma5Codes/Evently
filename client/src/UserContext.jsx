/* eslint-disable react/prop-types */
import {createContext, useEffect, useState} from "react";
import axios from 'axios';


export const UserContext = createContext({});

export function UserContextProvider({children}){
  const [user, setUser ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get('/profile')
      .then(({data}) => {
        setUser(data);
      })
      .catch((err) => {
        setError('Failed to load user profile.');
        setUser(null);
      })
      .finally(() => setLoading(false));
  },[]);

  return (
    <UserContext.Provider value={{user, setUser, loading, error}}>
      {children}
    </UserContext.Provider>
  )
}