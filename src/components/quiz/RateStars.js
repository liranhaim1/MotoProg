import React from "react";
import { Rating } from "react-simple-star-rating";

export function RatingStars({ onSubmit }) {
  // Catch Rating value
  const handleRating = (rate, _, event) => {
    // debugger
    onSubmit(rate);
    // other logic
  };
  // Optinal callback functions
  // const onPointerEnter = () => console.log('Enter')
  // const onPointerLeave = () => console.log('Leave')
  // const onPointerMove = (value, index) => console.log(value, index)

  return (
    // some bug in this library cause the click to propagate it behind
    <Rating
      className="rate-stars"
      onClick={handleRating}
      // onPointerEnter={onPointerEnter}
      // onPointerLeave={onPointerLeave}
      // onPointerMove={onPointerMove}
      /* Available Props */
    />
  );
}
