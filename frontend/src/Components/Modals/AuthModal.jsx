import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  message,
  Divider,
  Space,
} from "antd";
import {
  InboxOutlined,
  GoogleOutlined,
  GithubOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import UploadFileService from "../../Services/UploadFileService";
import AuthService from "../../Services/AuthService";
import UserService from "../../Services/UserService";
import "../../Styles/AuthModal.css";

const uploader = new UploadFileService();

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [signinFocused, setSigninFocused] = useState(true);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const toggleFocus = () => {
    setSigninFocused(!signinFocused);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    try {
      setIsLoading(true);
      if (signinFocused) {
        const response = await AuthService.login(
          values.username,
          values.password
        );
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("accessToken", response.accessToken);
        message.success("Welcome back");
        if (onSuccess) onSuccess();
        onClose();
        form.resetFields();
      } else {
        const exists = await UserService.checkIfUserExists(values.username);
        if (exists) {
          message.error("User already exists with this username");
          return;
        } else {
          const response = await AuthService.register(
            values.username,
            values.password
          );
          localStorage.setItem("userId", response.userId);
          localStorage.setItem("accessToken", response.accessToken);
        }

        let imageUrl = "";
        if (values.file) {
          imageUrl = await uploader.uploadFile(
            values.file[0].originFileObj,
            "userImages"
          );
        }

        const body = {
          userId: localStorage.getItem("userId"),
          image: imageUrl,
          email: values.email,
        };
        await UserService.createProfile(body);
        message.success("Welcome " + values.username);
        if (onSuccess) onSuccess();
        onClose();
        form.resetFields();
      }
    } catch (err) {
      message.error("Error: " + (err.message || "Unknown error occurred"));
    } finally {
      setIsLoading(false);
      form.resetFields();
      window.location.reload();
    }
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  return (
    <Modal 
      open={isOpen} 
      footer={null} 
      onCancel={onClose}
      width={520}
      className="auth-modal"
      title={null}
    >
      <div className="modal-background">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="pattern-overlay"></div>
      </div>
      
      <div className="modal-content">
        <div className="modal-header">
          <span className="badge">{signinFocused ? "Welcome Back" : "Join Us"}</span>
          <h2>{signinFocused ? "Sign In" : "Sign Up"}</h2>
        </div>
        
        <div className="oauth-section">
          <Button
            className="oauth-button google-button"
            icon={<GoogleOutlined />}
            onClick={() => handleOAuthLogin("google")}
          >
            Continue with Google
          </Button>
          
          <Button
            className="oauth-button github-button"
            icon={<GithubOutlined />}
            onClick={() => handleOAuthLogin("github")}
          >
            Continue with GitHub
          </Button>
          
          <div className="divider-container">
            <Divider className="custom-divider">OR</Divider>
          </div>
        </div>

        <Form
          name="authForm"
          form={form}
          initialValues={{ remember: true }}
          onFinish={handleFormSubmit}
          autoComplete="off"
          className="auth-form"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Username" 
              className="auth-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
              className="auth-input"
            />
          </Form.Item>

          {!signinFocused && (
            <>
              <Form.Item shouldUpdate={(prev, curr) => prev.password !== curr.password}>
                {({ getFieldValue }) => {
                  const password = getFieldValue("password") || "";
                  const rules = [
                    { label: "At least 8 characters", valid: password.length >= 8 },
                    { label: "At least 1 uppercase letter", valid: /[A-Z]/.test(password) },
                    { label: "At least 1 lowercase letter", valid: /[a-z]/.test(password) },
                    { label: "At least 1 number", valid: /\d/.test(password) },
                    { label: "At least 1 special character", valid: /[!@#$%^&*]/.test(password) },
                  ];

                  return (
                    <ul className="password-rules">
                      {rules.map((rule, idx) => (
                        <li key={idx} className={rule.valid ? "valid" : ""}>
                          {rule.label}
                        </li>
                      ))}
                    </ul>
                  );
                }}
              </Form.Item>

              <Form.Item
                name="confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords don't match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Confirm Password" 
                  className="auth-input"
                />
              </Form.Item>
              
              <Form.Item
                name="email"
                rules={[
                  { type: 'email', message: 'Please enter a valid email' },
                  { required: true, message: 'Please input your email' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="Email" 
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item
                name="file"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload.Dragger 
                  beforeUpload={() => false} 
                  multiple={false}
                  className="upload-dragger"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="upload-text">
                    Upload profile picture (optional)
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button 
              loading={isLoading} 
              htmlType="submit" 
              block
              className="auth-submit-button"
            >
              {signinFocused ? "Sign In" : "Sign Up"}
            </Button>
          </Form.Item>
          
          <div className="toggle-auth-mode">
            <span>{signinFocused ? "Need an account?" : "Already have an account?"}</span>
            <Button type="link" onClick={toggleFocus} className="toggle-button">
              {signinFocused ? "Sign Up" : "Sign In"}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default AuthModal;