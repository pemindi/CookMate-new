import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, DatePicker, Checkbox, message } from "antd";
import { useSnapshot } from "valtio";
import { Save, BookOpen, Calendar, Target, CheckCircle } from "lucide-react";
import state from "../../Utils/Store";
import SkillPlanService from "../../Services/SkillPlanService";
import dayjs from 'dayjs';
import "../../Styles/CreateSkillPlanModal.css";

const { Option } = Select;

const UpdateSkillPlanModal = () => {
  const snap = useSnapshot(state);
  const selectedSkillPlan = snap.selectedSkillPlanToUpdate;
  const [updateSkillPlanLoading, setUpdateSkillPlanLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedSkillPlan) {
      // Check both isFinished and finished properties to handle any backend inconsistency
      const isCompleted = 
        selectedSkillPlan.isFinished === true || 
        selectedSkillPlan.isFinished === "true" ||
        selectedSkillPlan.finished === true || 
        selectedSkillPlan.finished === "true";
      
      form.setFieldsValue({
        skillDetails: selectedSkillPlan.skillDetails,
        skillLevel: selectedSkillPlan.skillLevel,
        resources: selectedSkillPlan.resources,
        date: selectedSkillPlan.date ? dayjs(selectedSkillPlan.date) : null,
        isFinished: isCompleted,
      });
    }
  }, [form, selectedSkillPlan]);

  const updatePlan = async (values) => {
    try {
      setUpdateSkillPlanLoading(true);
      
      // Ensure userId is available
      if (!snap.currentUser?.uid) {
        message.error("User not authenticated");
        return;
      }
      
      // Create the updated plan - explicitly set both fields to match backend expectations
      const updatedPlan = {
        ...values,
        userId: snap.currentUser.uid, // Include user ID for ownership verification
        date: values.date.format("YYYY-MM-DD"),
        isFinished: Boolean(values.isFinished),
        finished: Boolean(values.isFinished) // Add this field to ensure backend compatibility
      };
      
      await SkillPlanService.updateSkillPlan(selectedSkillPlan.id, updatedPlan);
      
      // Update the local state immediately for better UX
      const updatedPlans = snap.skillPlans.map(plan => 
        plan.id === selectedSkillPlan.id 
          ? { 
              ...plan, 
              ...updatedPlan, 
              id: selectedSkillPlan.id,
              // Ensure both fields are set in the local state
              isFinished: Boolean(values.isFinished),
              finished: Boolean(values.isFinished)
            } 
          : plan
      );
      state.skillPlans = updatedPlans;
      
      // Refresh from server to ensure consistency
      const refreshedPlans = await SkillPlanService.getUserSkillPlans(snap.currentUser.uid);
      state.skillPlans = refreshedPlans;
      
      message.success("Skill plan updated successfully");
      state.updateSkillPlanOpened = false;
    } catch (error) {
      console.error("Error updating skill plan:", error);
      message.error("Failed to update skill plan");
    } finally {
      setUpdateSkillPlanLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="modal-title">
          <span className="title-badge">Update</span>
          <h2>Skill Plan</h2>
        </div>
      }
      open={snap.updateSkillPlanOpened}
      footer={null}
      onCancel={() => {
        state.updateSkillPlanOpened = false;
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
        onFinish={updatePlan}
        className="themed-form"
      >
        <div className="form-section">
          <div className="section-icon">
            <BookOpen size={24} />
          </div>
          <Form.Item
            name="skillDetails"
            label="Skill Details"
            rules={[{ required: true, message: "Please enter skill details" }]}
          >
            <Input.TextArea 
              className="themed-input"
              rows={4}
            />
          </Form.Item>
        </div>
        
        <div className="form-section">
          <div className="section-icon">
            <Target size={24} />
          </div>
          <Form.Item
            name="skillLevel"
            label="Skill Level"
            rules={[{ required: true, message: "Please select skill level" }]}
          >
            <Select className="themed-select" size="large">
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
            <BookOpen size={24} />
          </div>
          <Form.Item
            name="resources"
            label="Resources"
            rules={[{ required: true, message: "Please provide resources" }]}
          >
            <Input.TextArea 
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
          <div className="section-icon">
            <CheckCircle size={24} />
          </div>
          <Form.Item
            name="isFinished"
            valuePropName="checked"
            label="Is Finished?"
          >
            <Checkbox className="themed-checkbox" />
          </Form.Item>
        </div>
        
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={updateSkillPlanLoading}
            block
            className="themed-button update-button"
            icon={<Save size={18} />}
          >
            Update Skill Plan
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateSkillPlanModal;