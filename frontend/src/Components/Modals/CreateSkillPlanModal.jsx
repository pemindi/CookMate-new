import React, { useState } from "react";
import { Modal, Form, Input, Button, Select, DatePicker, Checkbox, message } from "antd";
import { useSnapshot } from "valtio";
import { PlusCircle, Book, Calendar, CheckCircle } from "lucide-react";
import state from "../../Utils/Store";
import SkillPlanService from "../../Services/SkillPlanService";
import dayjs from 'dayjs';
import "../../Styles/CreateSkillPlanModal.css";

const { Option } = Select;

const CreateSkillPlanModal = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Ensure userId is available
      if (!snap.currentUser?.uid) {
        message.error("User not authenticated");
        return;
      }

      // Create the skill plan with explicit boolean conversion for isFinished
      // Also include "finished" field to match backend expectations
      const newSkillPlan = {
        skillDetails: values.skillDetails,
        skillLevel: values.skillLevel,
        resources: values.resources,
        userId: snap.currentUser.uid,
        date: values.date.format("YYYY-MM-DD"),
        isFinished: Boolean(values.isFinished),
        finished: Boolean(values.isFinished) // Add this field to ensure backend compatibility
      };

      await SkillPlanService.createSkillPlan(newSkillPlan);
      
      // Refresh the skill plans list for the current user only
      const refreshedPlans = await SkillPlanService.getUserSkillPlans(snap.currentUser.uid);
      state.skillPlans = refreshedPlans;
      
      message.success("Skill plan created successfully");
      form.resetFields();
      state.createSkillPlanOpened = false;
    } catch (error) {
      console.error("Error creating skill plan:", error);
      message.error("Failed to create skill plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="modal-title">
          <span className="title-badge">New</span>
          <h2>Create Skill Plan</h2>
        </div>
      }
      open={snap.createSkillPlanOpened}
      footer={null}
      onCancel={() => {
        form.resetFields();
        state.createSkillPlanOpened = false;
      }}
      className="themed-modal"
      width={600}
    >
      <div className="modal-background">
        <div className="circle-decoration circle-deco-1"></div>
        <div className="circle-decoration circle-deco-2"></div>
        <div className="pattern-overlay"></div>
      </div>
      
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit}
        className="themed-form"
      >
        <div className="form-section">
          <div className="section-icon">
            <Book size={24} />
          </div>
          <Form.Item
            name="skillDetails"
            label="Skill Details"
            rules={[{ required: true, message: "Please enter skill details" }]}
          >
            <Input.TextArea 
              placeholder="What skill do you want to develop?" 
              className="themed-input"
              rows={4}
            />
          </Form.Item>
        </div>
        
        <div className="form-section">
          <div className="section-icon">
            <CheckCircle size={24} />
          </div>
          <Form.Item
            name="skillLevel"
            label="Skill Level"
            rules={[{ required: true, message: "Please select skill level" }]}
          >
            <Select 
              placeholder="Select skill level"
              className="themed-select"
              size="large"
            >
              <Option value="beginner">
                <span className="level-badge beginner">Beginner</span>
              </Option>
              <Option value="intermediate">
                <span className="level-badge intermediate">Intermediate</span>
              </Option>
              <Option value="advanced">
                <span className="level-badge advanced">Advanced</span>
              </Option>
            </Select>
          </Form.Item>
        </div>
        
        <div className="form-section">
          <div className="section-icon">
            <Book size={24} />
          </div>
          <Form.Item
            name="resources"
            label="Resources"
            rules={[{ required: true, message: "Please provide resources" }]}
          >
            <Input.TextArea 
              placeholder="Books, courses, websites, etc." 
              className="themed-input"
              rows={3}
            />
          </Form.Item>
        </div>
        
        <div className="form-section">
          <div className="section-icon">
            <Calendar size={24} />
          </div>
          <Form.Item
            name="date"
            label="Scheduled Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker 
              className="themed-datepicker" 
              style={{ width: "100%" }}
              size="large"
            />
          </Form.Item>
        </div>
        
        <div className="form-section checkbox-section">
          <Form.Item
            name="isFinished"
            valuePropName="checked"
            initialValue={false}
            label="Is Finished?"
          >
            <Checkbox className="themed-checkbox" />
          </Form.Item>
        </div>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            block
            className="themed-button"
            icon={<PlusCircle size={18} />}
          >
            Create Skill Plan
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSkillPlanModal;