import React from "react";
import { useSnapshot } from "valtio";
import { PlusCircle } from "lucide-react";
import state from "../../Utils/Store";

const CreateSkillPlanBox = () => {
  const snap = useSnapshot(state);
  
  return (
    <div
      className="create-skill-plan-box"
      onClick={() => {
        state.createSkillPlanOpened = true;
      }}
    >
      <div className="create-skill-plan-top">
        <div className="user-avatar-wrapper">
          <img
            alt="Profile"
            src={snap.currentUser?.image}
            className="user-avatar"
          />
          <div className="avatar-glow"></div>
        </div>
        
        <div className="skill-input-wrapper">
          <input
            type="text"
            placeholder={`Share your cooking skill plan, ${snap.currentUser?.username}`}
            className="skill-input"
            readOnly
          />
          <PlusCircle className="plus-icon" size={22} />
        </div>
      </div>
      
      <div className="create-skill-plan-decoration">
        <div className="decoration-circle decoration-circle-1"></div>
        <div className="decoration-circle decoration-circle-2"></div>
      </div>
    </div>
  );
};

export default CreateSkillPlanBox;