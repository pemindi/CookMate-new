import React, { useState, useEffect } from "react";
import { Modal, Switch, Input, Button, Upload, message, Form } from "antd";
import { UploadOutlined, LoadingOutlined, UserOutlined, LockOutlined, LogoutOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import UserService from "../../Services/UserService";
import { useNavigate } from "react-router-dom";
import "../../Styles/UserProfileModal.css";

const uploader = new UploadFileService();
const { Item } = Form;

const UserProfileModal = () => {
  const snap = useSnapshot(state);
  const [uploadUserLoading, setUploadUserLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Reset imageChanged state when modal opens
  useEffect(() => {
    if (snap.profileModalOpend) {
      setImageChanged(false);
    }
  }, [snap.profileModalOpend]);

  const handleUpdateProfile = async () => {
    try {
      setUpdateLoading(true);
      const formData = form.getFieldsValue();
      
      // Only handle image upload if it's a File object and has been changed
      if (formData.image instanceof File && imageChanged) {
        formData.image = await handleFileUpload(formData.image);
      }
      
      await UserService.updateUserPrifile({
        ...formData,
        uid: snap.currentUser?.id,
      });

      // After successful update, refresh current user data
      const updatedUserData = await UserService.getProfile();
      state.currentUser = updatedUserData; // Update the global state

      state.profileModalOpend = false;
      message.success("Profile updated successfully");
      setImageChanged(false);
    } catch (error) {
      console.error("Error updating profile:", error.message);
      message.error("Profile updating failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const url = await uploader.uploadFile(file, "userImages");
      return url;
    } catch (error) {
      throw new Error("File upload failed");
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setUploadUserLoading(true);
      setImageChanged(true);
      
      try {
        const imageUrl = await handleFileUpload(info.fileList[0].originFileObj);
        form.setFieldsValue({ image: imageUrl });
        message.success("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        message.error("Failed to upload image");
        setImageChanged(false);
      } finally {
        setUploadUserLoading(false);
      }
    }
  };

  const handleDeleteProfile = async () => {
    try {
      setDeleteLoading(true);
      await UserService.deleteUserProfileById(snap.currentUser?.uid);
      message.success("Profile deleted successfully");

      // After successful deletion, navigate to the login page or logout
      localStorage.clear();
      navigate("/"); // Redirect to home or login page after deletion
    } catch (error) {
      console.error("Error deleting user:", error.message);
      message.error("Profile deletion failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const hasFormChanged = () => {
    const currentValues = form.getFieldsValue();
    const initialValues = snap.currentUser;
  
    if (!initialValues) return false;
  
    return (
      currentValues.profileVisibility !== initialValues.profileVisibility ||
      imageChanged
    );
  };
  
  return (
    <Modal
      open={snap.profileModalOpend}
      onCancel={() => {
        state.profileModalOpend = false;
      }}
      width={700}
      className="profile-modal"
      footer={null}
    >
      <div className="modal-background">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="pattern-overlay"></div>
      </div>
      
      <div className="modal-content">
        <div className="modal-header">
          <span className="badge">Your Profile</span>
          <h2>User Profile</h2>
        </div>
        
        <div className="profile-container">
          <div className="profile-image-section">
            {form.getFieldValue("image") ? (
              <div className="profile-image-wrapper">
                <img
                  src={form.getFieldValue("image")}
                  alt="Profile"
                  className="profile-image"
                />
              </div>
            ) : (
              <div className="profile-image-placeholder">
                <UserOutlined />
              </div>
            )}
            
            <Form form={form} initialValues={snap.currentUser} className="upload-form">
              <Item name="image" className="upload-item">
                <Upload
                  accept="image/*"
                  onChange={handleFileChange}
                  showUploadList={false}
                  beforeUpload={() => false}
                  disabled={uploadUserLoading}
                >
                  <Button 
                    className="cta-secondary upload-btn"
                    icon={uploadUserLoading ? <LoadingOutlined /> : <UploadOutlined />} 
                    disabled={uploadUserLoading}
                  >
                    {uploadUserLoading ? "Uploading..." : "Change Photo"}
                  </Button>
                </Upload>
              </Item>
            </Form>
          </div>
          
          <div className="profile-form-section">
            <Form form={form} initialValues={snap.currentUser} layout="vertical" className="profile-form">
              <Item name="username" label="Username">
                <Input 
                  disabled 
                  prefix={<UserOutlined />}
                  className="profile-input"
                />
              </Item>
              
              <Item
                name="profileVisibility"
                label="Profile Visibility"
                valuePropName="checked"
                className="visibility-switch"
              >
                <div className="switch-wrapper">
                  <Switch disabled={uploadUserLoading} />
                  <span className="switch-label">
                    {form.getFieldValue("profileVisibility") ? "Public" : "Private"}
                  </span>
                </div>
              </Item>
              
              <div className="action-buttons">
                <Button
                  className="cta-primary update-btn"
                  loading={updateLoading}
                  onClick={handleUpdateProfile}
                  disabled={uploadUserLoading || (!hasFormChanged() && !imageChanged)}
                >
                  Update Profile
                </Button>
                
                <div className="secondary-actions">
                  <Button
                    icon={<DeleteOutlined />}
                    loading={deleteLoading}
                    danger
                    className="action-btn delete-btn"
                    onClick={handleDeleteProfile}
                    disabled={uploadUserLoading || updateLoading}
                  >
                    Delete Account
                  </Button>
                  
                  <Button
                    icon={<LogoutOutlined />}
                    danger
                    className="action-btn logout-btn"
                    onClick={() => {
                      localStorage.clear();
                      navigate("/");
                    }}
                    disabled={uploadUserLoading || updateLoading || deleteLoading}
                  >
                    Logout
                  </Button>
                </div>
                
                <Button 
                  className="cancel-btn"
                  onClick={() => (state.profileModalOpend = false)}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserProfileModal;