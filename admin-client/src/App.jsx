import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from "./components/Signin.jsx";
import Signup from "./components/Signup.jsx";
import Appbar from "./components/Appbar.jsx";
import AddCourse from "./components/AddCourse.jsx";
import Courses from "./components/Courses";
import Course from "./components/Course";
import {Landing} from "./components/Landing.jsx";
import {useState, useEffect} from "react";
import axios from "axios";
import {BASE_URL} from "./config.js";

function App() {
    const [userEmail, setUserEmail] = useState(null)

    const init = async() => {
        const response = await axios.get(`${BASE_URL}/admin/me`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })

        if (response.data.username) {
            setUserEmail(response.data.username)
        }
    };

    useEffect(() => {
        init();
    }, []);
    return (
        <div style={{width: "100vw",
            height: "100vh",
            backgroundColor: "#eeeeee"}}
        >
                <Router>
                    <Appbar userEmail={userEmail} setUserEmail={setUserEmail}/>
                    <Routes>
                        <Route path={"/addcourse"} element={<AddCourse />} />
                        <Route path={"/course/:courseId"} element={<Course />} />
                        <Route path={"/courses"} element={<Courses />} />
                        <Route path={"/signin"} element={<Signin setUserEmail={setUserEmail} />} />
                        <Route path={"/signup"} element={<Signup setUserEmail={setUserEmail} />} />
                        <Route path={"/"} element={<Landing userEmail={userEmail} />} />
                    </Routes>
                </Router>

        </div>
    );
}

export default App;