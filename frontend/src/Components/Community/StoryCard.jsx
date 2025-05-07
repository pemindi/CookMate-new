import React from "react";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import { Avatar } from "antd";
import { UserOutlined, CheckCircleFilled } from "@ant-design/icons";

const StoryCard = ({ card }) => {
  const snap = useSnapshot(state);
  
  // Find the author from users list
  const author = snap.users?.find(user => user.id === card.userId);
  
  // Check if this is a new story (posted within the last 24 hours)
  const isNewStory = () => {
    if (!card.timestamp) return false;
    const storyTime = new Date(card.timestamp).getTime();
    const currentTime = new Date().getTime();
    const hoursDifference = (currentTime - storyTime) / (1000 * 60 * 60);
    return hoursDifference < 24;
  };

  const handleClick = () => {
    state.selectedStory = card;
    state.StoryOpen = true;
  };

  return (
    <div className={`story-card ${isNewStory() ? 'new-content' : ''}`} onClick={handleClick}>
      <div className="story-image-container">
        <img src={card.image} alt={card.title} className="story-image" />
        <div className="story-author">
          <Avatar 
            src={author?.image} 
            icon={<UserOutlined />} 
            size="small"
          />
        </div>
        
        {/* Verified badge for certain stories */}
        {card.verified && (
          <div className="verified-content">
            <CheckCircleFilled />
          </div>
        )}
      </div>
      <div className="story-title">{card.title}</div>
    </div>
  );
};

export default StoryCard;



/*import React from "react";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const StoryCard = ({ card }) => {
  const snap = useSnapshot(state);

  const handleClick = () => {
    state.selectedStory = card;
    state.StoryOpen = true;
  };

  return (
    <div className="story-card" onClick={handleClick}>
      <div className="story-image-container">
        <img src={card.image} alt={card.title} className="story-image" />
        <div className="story-author">
          <Avatar 
            src={snap.users?.find(user => user.id === card.userId)?.image} 
            icon={<UserOutlined />} 
            size="small"
          />
        </div>
      </div>
      <div className="story-title">{card.title}</div>
    </div>
  );
};

export default StoryCard;*/