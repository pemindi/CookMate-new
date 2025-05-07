// LearningDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Tabs,
  Card,
  Tag,
  Empty,
  Spin,
  Statistic,
  Row,
  Col,
  Button,
} from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import LearningService from "../../Services/LearningService";
import MyLearning from "./MyLearning";
import CreateLearningModal from "../Modals/CreateLearningModal";
import "../../Styles/LearningDashboard.css";

import LearningDetailsModal from "../Modals/LearningDetailsModal";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  PauseCircleOutlined,
  CalendarOutlined,
  TrophyOutlined,
  BookOutlined,
  ExperimentOutlined,
  TeamOutlined,
  PlusOutlined
} from "@ant-design/icons";

const { TabPane } = Tabs;

const LearningDashboard = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    onHold: 0,
    planned: 0,
    recent: 0,
    byTemplate: {}
  });

  const loadUserLearning = async () => {
    if (!snap.currentUser?.uid) return;
    try {
      setLoading(true);
      const userLearning = await LearningService.getLearningByUserId(
        snap.currentUser.uid
      );
      userLearning.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      state.learningEntries = userLearning;

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const templateCounts = {};
      const completed = userLearning.filter(e => e.status === "Completed").length;
      const inProgress = userLearning.filter(e => e.status === "In Progress").length;
      const onHold = userLearning.filter(e => e.status === "On Hold").length;
      const planned = userLearning.filter(e => e.status === "Planned").length;
      const recent = userLearning.filter(e => new Date(e.timestamp) > oneWeekAgo).length;
      userLearning.forEach(e => {
        const template = e.template || "general";
        templateCounts[template] = (templateCounts[template] || 0) + 1;
      });
      setStats({
        total: userLearning.length,
        completed,
        inProgress,
        onHold,
        planned,
        recent,
        byTemplate: templateCounts
      });
    } catch (err) {
      console.error("Failed to fetch learning entries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserLearning();
  }, [snap.currentUser?.uid]);

  const handleViewDetails = (learning) => {
    state.selectedLearning = learning;
    state.learningDetailsModalOpened = true;
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "Completed":
        return <Tag className="status-tag completed" icon={<CheckCircleOutlined />}>Completed</Tag>;
      case "In Progress":
        return <Tag className="status-tag in-progress" icon={<ClockCircleOutlined />}>In Progress</Tag>;
      case "On Hold":
        return <Tag className="status-tag on-hold" icon={<PauseCircleOutlined />}>On Hold</Tag>;
      case "Planned":
        return <Tag className="status-tag planned" icon={<CalendarOutlined />}>Planned</Tag>;
      default:
        return <Tag className="status-tag">{status}</Tag>;
    }
  };

  const getTemplateIcon = (template) => {
    switch (template) {
      case "project":
        return <ExperimentOutlined className="template-icon project" />;
      case "certification":
        return <TrophyOutlined className="template-icon certification" />;
      case "challenge":
        return <ExperimentOutlined className="template-icon challenge" />;
      case "workshop":
        return <TeamOutlined className="template-icon workshop" />;
      default:
        return <BookOutlined className="template-icon general" />;
    }
  };

  const getTemplateLabel = (template) => {
    switch (template) {
      case "project":
        return "Project";
      case "certification":
        return "Certification";
      case "challenge":
        return "Challenge";
      case "workshop":
        return "Workshop";
      default:
        return "General";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const renderLearningCard = (learning) => (
    <Card
      key={learning.id}
      className={`learning-card template-${learning.template || 'general'}`}
      title={
        <div className="learning-card-title">
          <span className="template-icon-wrapper">{getTemplateIcon(learning.template)}</span>
          <span>{learning.topic}</span>
        </div>
      }
      extra={getStatusTag(learning.status)}
      onClick={() => handleViewDetails(learning)}
    >
      <div className="card-content">
        <p className="template-tag">{getTemplateLabel(learning.template)}</p>
        <p className="description">{learning.description}</p>
        <div className="card-footer">
          <span className="timestamp">
            <CalendarOutlined className="timestamp-icon" /> {formatDate(learning.timestamp)}
          </span>
          <Button type="link" className="details-button" onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(learning);
          }}>
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="learning-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Learning Dashboard</h2>
          <div className="header-accent"></div>
        </div>
        <Button 
          className="add-learning-button"
          icon={<PlusOutlined />} 
          onClick={() => {
            state.createLearningModalOpened = true;
          }}
        >
          Add Learning
        </Button>
      </div>

      <div className="stats-section">
        <Row gutter={16}>
          <Col span={4}>
            <Card className="stat-card total">
              <Statistic title="All Items" value={stats.total} prefix={<BookOutlined />} />
            </Card>
          </Col>
          <Col span={4}>
            <Card className="stat-card completed">
              <Statistic title="Completed" value={stats.completed} prefix={<CheckCircleOutlined />} />
            </Card>
          </Col>
          <Col span={4}>
            <Card className="stat-card in-progress">
              <Statistic title="Ongoing" value={stats.inProgress} prefix={<ClockCircleOutlined />} />
            </Card>
          </Col>
          <Col span={4}>
            <Card className="stat-card on-hold">
              <Statistic title="Waiting" value={stats.onHold} prefix={<PauseCircleOutlined />} />
            </Card>
          </Col>
          <Col span={4}>
            <Card className="stat-card planned">
              <Statistic title="Upcoming" value={stats.planned} prefix={<CalendarOutlined />} />
            </Card>
          </Col>
          <Col span={4}>
            <Card className="stat-card recent">
              <Statistic title="This Week" value={stats.recent} prefix={<CalendarOutlined />} />
            </Card>
          </Col>
        </Row>
      </div>

      <MyLearning />

      <div className="learning-content">
        {/* Wrap the Tabs component in a scrollable container */}
        <div className="tabs-scrollable-container">
          <Tabs defaultActiveKey="all" className="learning-tabs">
            <TabPane tab="All Learning" key="all">
              <div className="learning-grid">
                {snap.learningEntries?.length > 0 ? snap.learningEntries.map(renderLearningCard) : 
                  <Empty 
                    className="empty-state"
                    description="No learning entries found" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  />
                }
              </div>
            </TabPane>
            <TabPane tab="Recent" key="recent">
              <div className="learning-grid">
                {snap.learningEntries?.filter(entry => new Date(entry.timestamp) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length > 0 ? (
                  snap.learningEntries.filter(entry => new Date(entry.timestamp) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).map(renderLearningCard)
                ) : (
                  <Empty 
                    className="empty-state"
                    description="No recent learning entries" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  />
                )}
              </div>
            </TabPane>
            <TabPane tab="In Progress" key="inProgress">
              <div className="learning-grid">
                {snap.learningEntries?.filter(entry => entry.status === "In Progress").length > 0 ? (
                  snap.learningEntries.filter(entry => entry.status === "In Progress").map(renderLearningCard)
                ) : (
                  <Empty 
                    className="empty-state"
                    description="No in-progress entries found" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  />
                )}
              </div>
            </TabPane>
            <TabPane tab="On Hold" key="onHold">
              <div className="learning-grid">
                {snap.learningEntries?.filter(entry => entry.status === "On Hold").length > 0 ? (
                  snap.learningEntries.filter(entry => entry.status === "On Hold").map(renderLearningCard)
                ) : (
                  <Empty 
                    className="empty-state"
                    description="No on-hold entries found" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  />
                )}
              </div>
            </TabPane>
            <TabPane tab="Planned" key="planned">
              <div className="learning-grid">
                {snap.learningEntries?.filter(entry => entry.status === "Planned").length > 0 ? (
                  snap.learningEntries.filter(entry => entry.status === "Planned").map(renderLearningCard)
                ) : (
                  <Empty 
                    className="empty-state"
                    description="No planned entries found" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  />
                )}
              </div>
            </TabPane>
            <TabPane tab="Projects" key="projects">
              <div className="learning-grid">
                {snap.learningEntries?.filter(entry => entry.template === "project").length > 0 ? (
                  snap.learningEntries.filter(entry => entry.template === "project").map(renderLearningCard)
                ) : (
                  <Empty 
                    className="empty-state"
                    description="No project entries found" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  />
                )}
              </div>
            </TabPane>
            <TabPane tab="Certifications" key="certifications">
              <div className="learning-grid">
                {snap.learningEntries?.filter(entry => entry.template === "certification").length > 0 ? (
                  snap.learningEntries.filter(entry => entry.template === "certification").map(renderLearningCard)
                ) : (
                  <Empty 
                    className="empty-state"
                    description="No certification entries found" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  />
                )}
              </div>
            </TabPane>
            <TabPane tab="Challenges" key="challenges">
              <div className="learning-grid">
                {snap.learningEntries?.filter(entry => entry.template === "challenge").length > 0 ? (
                  snap.learningEntries.filter(entry => entry.template === "challenge").map(renderLearningCard)
                ) : (
                  <Empty 
                    className="empty-state"
                    description="No challenge entries found" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  />
                )}
              </div>
            </TabPane>
            <TabPane tab="Workshops" key="workshops">
              <div className="learning-grid">
                {snap.learningEntries?.filter(entry => entry.template === "workshop").length > 0 ? (
                  snap.learningEntries.filter(entry => entry.template === "workshop").map(renderLearningCard)
                ) : (
                  <Empty 
                    className="empty-state"
                    description="No workshop entries found" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  />
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
      
      {/* Adding the modals and passing the refresh function */}
      <CreateLearningModal onRefresh={loadUserLearning} />
      <LearningDetailsModal onRefresh={loadUserLearning} />
    </div>
  );
};

export default LearningDashboard;