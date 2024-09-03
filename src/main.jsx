import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import CartContextProvider from "./Context/CartContext.jsx";
import UserContextProvider from "./Context/userContext.jsx";
import WishlistContextProvider from "./Context/WishlistContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <WishlistContextProvider>
          <UserContextProvider>
              <CartContextProvider>
                  <App />
              </CartContextProvider>
          </UserContextProvider>
      </WishlistContextProvider>

  </StrictMode>,
)
