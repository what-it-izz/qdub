import React, { useState, useEffect } from 'react';
import logo from "../assets/logo.svg";
import {useNavigate} from 'react-router-dom'
import "./RegistrationForm.css";
import "./Button.css";
import "./Logo.css";
import * as api from "../api/index.js"

export const RegistrationForm = ( {setStudentID} ) => {
  const [courses, setCourses] = useState({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isTA, setIsTA] = useState(false);
  const studentID = useState(0);

  // navigation route
  let navigate = useNavigate();
  const routeChangeTA = () => {
    let path = `/ta-view`;
    navigate(path);
  }
  const routeChangeStudent = () => {
    let path = `/student-view`;
    navigate(path);
  }

  // To get course list upon page load
  useEffect(() => {
    const getCourses = async () => {
      const response = await fetch('/formtest', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const responseData = await response.json();

      setCourses(responseData.courses);

      // console.log(responseData);
    };
    getCourses();
  }, []);

  useEffect(() => {
    console.log(courses);
  }, [courses]);


  // MAIN onclick event
  const getData = async () => {
    const response = await fetch('/enqueue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentID: studentID,
        firstName: firstName,
        lastName: lastName,
        isTA: isTA,
          courses: courses
      }),
    });

    if (isTA) {
      routeChangeTA();
    } else {
      routeChangeStudent();
    }

    const responseData = await response.json();
    setStudentID(responseData.studentID);
    // error handling goes here

  };

  // to put the courses in a list format to display in drop down
  const options = Object.keys(courses).map(course =>
    <option value={course}>
      {course + "-" + courses[course]}
    </option>)

  return (
    <div className="registration">
      <img className="logo" src={logo} alt="top left circles" />
      <span className="title">Queue prototype</span>
      <span className="description">
        Manual student&#x2F;TA enqueue-ing for prototype
      </span>
      <label>
        First Name: <input className="input" value={firstName} placeholder="Enter your first name" onChange={e => setFirstName(e.target.value)} />
      </label>
      <label>
        Last Name: <input className="input" value={lastName} placeholder="Enter your last name" onChange={e => setLastName(e.target.value)} />
      </label>
      <label>
        Choose a Course:
        <select id="course" value={courses} onChange={e => setCourses(e.target.value)}>
          <option value="">Select Course</option>
          {options}
        </select>

      </label>
      <label>
        <input className="checkBox" type="checkbox" onChange={() => setIsTA(!isTA)} /> Are you a TA?
      </label>
      <button className="button" type="submit"
        onClick={() => getData()}>
        Sign up!
      </button>
    </div>
  );
}