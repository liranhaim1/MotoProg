import React, { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { mapStateToProps, mapDispatchToProps } from "../../store";
import { connect } from "react-redux";

const Category = () => {
  const navigate = useNavigate();

  const handleClick = (event) => {
    const category = event.target.textContent;
    switch (category) {
      case 'Python':
        navigate("/play/Python");
        break;
      case 'Data Structure':
        navigate("/play/Data");
        break;
      case 'OOP':
        navigate("/play/OOP");
        break;
      case 'Operation Systems':
        navigate("/play/Operation");
        break;
      case 'Linux':
        navigate("/play/Linux");
        break;
      case 'General Questions':
        navigate("/play/General");
        break;



    }
  };

  const historyClick = () => {

    navigate("/play/history");

  }
  return (
    <>
      <div id="category">
        <div className="bg-blur" />
        <div className="container">
          <h3 className="title roboto">
            Select a category you'd like to test your knowledge on!
          </h3>
          <div className="grid">
            <button className="button" onClick={handleClick}>
              Python
            </button>
            <button className="button" onClick={handleClick}>
              Data Structure
            </button>
            <button className="button" onClick={handleClick}>
              OOP
            </button>
            <button className="button" onClick={handleClick}>
              Operation Systems
            </button>
            <button className="button" onClick={handleClick}>
              Linux
            </button>
            <button className="button" onClick={handleClick}>
              General Questions
            </button>
          </div>


          
         <div className='center' >
         <button  className="button" onClick={historyClick}>
            Game History
          </button>

         </div>
        </div>
      </div>

    </>

  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);
