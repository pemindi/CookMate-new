// MyLearning.jsx
import React from "react";
import { useSnapshot } from "valtio";
import { BookOpen, Award, ChevronRight } from "lucide-react";
import state from "../../Utils/Store";
import "../../Styles/MyLearning.css";

const MyLearning = () => {
  const snap = useSnapshot(state);
  
  // Handler to open the create learning modal
  const handleStartTracking = () => {
    state.createLearningModalOpened = true;
  };

  return (
    <div className="my-learning-section">
      <h3 className="my-learning-title">My Learning Journey</h3>
      <div className="my-learning-subtitle">Track and manage your learning activities</div>
      
      <div className="mylearning-cards-container">
        {/* Start Tracking Card */}
        <div className="mylearning-journey-card start-tracking">
          <div className="journey-card-content">
            <h4 className="journey-card-title">Start Tracking</h4>
            <button 
              className="journey-card-button" 
              onClick={handleStartTracking}
              aria-label="Start tracking learning"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="journey-card-badge">
            <Award className="badge-icon" size={14} />
            <span>Learning Tracker</span>
          </div>
        </div>
        
        {/* Continue Learning Card */}
        <div className="mylearning-journey-card continue-learning">
          <div className="journey-card-content">
            <h4 className="journey-card-title">Continue Learning</h4>
            <button 
              className="journey-card-button"
              onClick={() => document.querySelector('[data-tab-key="inProgress"]')?.click()}
              aria-label="View in-progress learning"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLearning;