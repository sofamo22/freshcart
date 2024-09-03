import { createContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

export let userContext = createContext();

export default function UserContextProvider({ children }) {
  const [userLogin, setuserLogin] = useState(null);
  let [userId, setUserId] = useState(null);
  // Check if user is already logged in
  useEffect(() => {
    let token = localStorage.getItem("userToken");
    if (token) {
      setuserLogin(token);
      let data = jwtDecode(token);
      setUserId(data.id);
    }
  }, []);
  return (
    <userContext.Provider value={{ userLogin, setuserLogin , setUserId , userId}}>
      {children}
    </userContext.Provider>
  );
}
