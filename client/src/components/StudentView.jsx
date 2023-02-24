import { useState, useEffect } from 'react';
import "./StudentView.css";
import "./Button.css";
import "./Logo.css";
import "./TalkingDog.css";
import dog from "../assets/dog.png";
import Modal from './Modal';

const StudentView = ({netId, selectedCourse, isTa, numberOfPeople, estimatedWait, props}) => {
  const [queueSize, setQueueSize] = useState();
  const [waitTime, setWaitTime] = useState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Define a function that makes the API call and updates the data state
    const fetchData = async () => {
      const response = await fetch(`http://localhost:3001/queue/${selectedCourse}/${isTa}/${netId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const responseData = await response.json();
      setQueueSize(responseData.numberOfPeople);
      setWaitTime(responseData.estimatedWait);
    };

    // Call the function immediately and then schedule it to be called every 10 seconds
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 500);

    // Return a cleanup function that clears the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="view">
      <div className="header">
        {/* <img className="logo" src={logo} alt="top left circles" /> */}
        <span className="peopleAheadDesc">
          The number of people ahead of you
        </span>
        <div>
          <span className="peopleAheadNum">
            {queueSize}
          </span>
        </div>
        <span className="estimate">
          We estimate a wait time of
        </span>
        <span className="waitTime">
          {waitTime} minutes
        </span>
      </div>

      <div className="imageSet">
        <img className="dog" src={dog} alt="cute dog" />
      </div>
      <button className="button" onClick={() => setShow(true)}>Stepping out!</button>

      <Modal
        title="You are currently out of the queue!"
        isQueue={true}
        isLogin={false}
        onStepIn={() => setShow(false)}
        show={show}
      >
        <p>Press "Step in!" to go back</p>
      </Modal>

    </div>
  );
};
export default StudentView;