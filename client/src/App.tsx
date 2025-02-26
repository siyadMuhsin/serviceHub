import AppRoutes from "./routes/AppRoutes";
import { Provider } from 'react-redux'
import {store} from './store'
import { ToastContainer } from "react-toastify";


const App = () => {
  return (
    
      <Provider store={store}>
        <ToastContainer theme="dark" />
<AppRoutes/>

    </Provider>

   
    
      
   
 
  )
}

export default App