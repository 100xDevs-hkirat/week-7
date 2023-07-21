import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from "./components/Signin.jsx";
import Signup from "./components/Signup.jsx";
import Appbar from "./components/Appbar.jsx";
import AddCourse from "./components/AddCourse.jsx";
import Courses from "./components/Courses";
import Course from "./components/Course";
import {Landing} from "./components/Landing.jsx";

function App() {

    return (
        <div style={{width: "100vw",
            height: "100vh",
            backgroundColor: "#eeeeee"}}
        >
                <Router>
                    <Appbar />
                    <Routes>
                        <Route path={"/addcourse"} element={<AddCourse />} />
                        <Route path={"/course/:courseId"} element={<Course />} />
                        <Route path={"/courses"} element={<Courses />} />
                        <Route path={"/signin"} element={<Signin />} />
                        <Route path={"/signup"} element={<Signup />} />
                        <Route path={"/"} element={<Landing />} />
                    </Routes>
                </Router>

        </div>
    );
}

export default App;