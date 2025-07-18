import { Outlet } from 'react-router-dom';
import ThemeProvider from './contextComponents/ThemeState';
import Navbar from './staticComponents/Navbar';
import Footer from './staticComponents/Footer'
import './App.css';
import AlertProvider from './contextComponents/AlertState';
import Alert from './staticComponents/Alert';
import NoteProvider from './contextComponents/NoteState';
import LoadingBarProvider from './contextComponents/LoadingBarState';

function App() {
  // Set the document body style
  document.body.style.backgroundColor = "#fefee3"
  document.body.style.color = "black";
  return (
    <>
      <ThemeProvider>
        <AlertProvider>
          <LoadingBarProvider>
            <Navbar />
            <Alert />
            <NoteProvider>
              <div className="container mb-3" style={{ minHeight: "100vh", marginTop: "3rem" }}>
              <Outlet />
            </div>
            </NoteProvider>
            <Footer />
          </LoadingBarProvider>
        </AlertProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
