import React from "react";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import "../../Styles/MyPost.css";

const MyPost = () => {
  const snap = useSnapshot(state);
  
  return (
    <div
      onClick={() => {
        state.createPostModalOpened = true;
      }}
      className="mypost-container"
    >
      <div className="mypost-background">
        <div className="mypost-circle circle-1"></div>
        <div className="mypost-circle circle-2"></div>
        <div className="pattern-overlay"></div>
      </div>
      
      <div className="mypost-content">
        <div className="mypost-icon">
          <i className="fas fa-plus-circle"></i>
        </div>
        <div className="mypost-text">
          <h3>Create New Post</h3>
          <p>Share your thoughts with the community</p>
        </div>
      </div>
      
      <div className="floating-element floating-element-1">
        <i className="fas fa-star"></i>
      </div>
      <div className="floating-element floating-element-2">
        <i className="fas fa-heart"></i>
      </div>
    </div>
  );
};

export default MyPost;




/*import React from "react";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import "../../Styles/MyPost.css" ;// (Your CSS file should be applied)

const MyPost = () => {
  const snap = useSnapshot(state);
  
  return (
    <div
      onClick={() => {
        state.createPostModalOpened = true;
      }}
      className="mypost-container"
    >
      <div className="accent-bar"></div>
      <div className="post-content">
        <div className="post-icon">
          <i className="fas fa-edit"></i>
        </div>
        <div className="post-text">
          <div className="post-description">+ Add a new post to share with the community</div>
        </div>
      </div>
      <div className="hover-overlay"></div>
    </div>
  );
};

export default MyPost;
*/
