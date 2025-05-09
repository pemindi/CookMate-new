import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload, Spin } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import PostService from "../../Services/PostService";
import UploadFileService from "../../Services/UploadFileService";
import { UploadOutlined, PictureOutlined, VideoCameraOutlined } from "@ant-design/icons";

const uploader = new UploadFileService();

const UploadPostModal = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const selectedPost = snap.selectedPost;
  const [fileType, setFileType] = useState("image");
  const [image, setImage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    setImage(selectedPost?.mediaLink);
    setFileType(selectedPost.mediaType);
    form.setFieldsValue({
      contentDescription: selectedPost?.contentDescription,
    });
  }, [snap.selectedPost, form]);

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const body = {
        contentDescription: values.contentDescription,
        mediaLink: image,
        mediaType: fileType,
      };
      await PostService.updatePost(selectedPost.id, body);
      state.posts = (await PostService.getPosts()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      state.updatePostModalOpened = false; // Close the modal after update
    } catch (error) {
      console.error("Failed to update post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      const fileType = info.file.type.split("/")[0];
      setFileType(fileType);
      const url = await uploader.uploadFile(
        info.fileList[0].originFileObj,
        "posts"
      );
      setImage(url);
    }
    setImageUploading(false);
  };

  const handleCancel = () => {
    state.updatePostModalOpened = false;
  };

  return (
    <Modal
      className="create-post-modal"
      open={snap.updatePostModalOpened}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          disabled={imageUploading}
          key="update"
          type="primary"
          loading={loading}
          onClick={form.submit}
          className="submit-button"
        >
          Update
        </Button>,
      ]}
      bodyStyle={{ padding: "20px" }}
      width={500}
    >
      <div className="modal-background">
        <div className="modal-circle circle-1"></div>
        <div className="modal-circle circle-2"></div>
        <div className="pattern-overlay"></div>
      </div>
      
      <div className="modal-title">
        <h2 className="modal-title-text">Update Post</h2>
        <div className="modal-title-decoration"></div>
      </div>
      
      <Form
        className="create-post-form"
        form={form}
        initialValues={{ contentDescription: selectedPost.contentDescription }}
        onFinish={handleUpdate}
        layout="vertical"
      >
        <Form.Item
          name="contentDescription"
          label={<span className="form-label">Content Description</span>}
          rules={[
            { required: true, message: "Please enter content description" },
          ]}
        >
          <Input.TextArea 
            className="content-textarea" 
            rows={4}
            placeholder="Share what's on your mind..."
          />
        </Form.Item>
        
        {imageUploading ? (
          <div className="uploading-indicator">
            <div className="uploading-spinner"></div>
            <p>Please wait, media is uploading...</p>
          </div>
        ) : (
          <Form.Item 
            name="mediaLink" 
            label={<span className="form-label">Media</span>}
          >
            <Upload
              className="media-upload"
              accept="image/*,video/*"
              onChange={handleFileChange}
              showUploadList={false}
              beforeUpload={() => false}
              style={{ marginBottom: "1rem" }}
            >
              <Button className="upload-button" icon={<UploadOutlined />}>
                Change Media
              </Button>
            </Upload>
          </Form.Item>
        )}
        
        {image && !imageUploading && (
          <div className="media-preview">
            <div className="media-type-icon">
              {fileType === "image" ? <PictureOutlined /> : <VideoCameraOutlined />}
            </div>
            
            {fileType === "image" && (
              <img
                src={image}
                alt="preview"
                className="preview-image"
              />
            )}
            
            {fileType === "video" && (
              <video 
                controls 
                src={image} 
                className="preview-video"
              />
            )}
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default UploadPostModal;



/*import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import PostService from "../../Services/PostService";
import UploadFileService from "../../Services/UploadFileService";
import { UploadOutlined } from "@ant-design/icons";
const uploader = new UploadFileService();
const UploadPostModal = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const selectedPost = snap.selectedPost;
  const [fileType, setFileType] = useState("image");
  const [image, setImage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    setImage(selectedPost?.mediaLink);
    setFileType(selectedPost.mediaType);
    form.setFieldsValue({
      contentDescription: selectedPost?.contentDescription,
    });
  }, [snap.selectedPost]);

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const body = {
        contentDescription: values.contentDescription,
        mediaLink: image,
        mediaType: fileType,
      };
      await PostService.updatePost(selectedPost.id, body);
      state.posts = (await PostService.getPosts()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      state.updatePostModalOpened = false; // Close the modal after update
    } catch (error) {
      console.error("Failed to update post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      const fileType = info.file.type.split("/")[0];
      setFileType(fileType);
      const url = await uploader.uploadFile(
        info.fileList[0].originFileObj,
        "posts"
      );
      setImage(url);
    } else if (info.file.status === "removed") {
    }
    setImageUploading(false);
  };

  return (
    <Modal
      open={snap.updatePostModalOpened}
      onCancel={() => {
        state.updatePostModalOpened = false;
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => (state.updatePostModalOpened = false)}
        >
          Cancel
        </Button>,
        <Button
          disabled={imageUploading}
          key="update"
          type="primary"
          loading={loading}
          onClick={form.submit}
        >
          Update
        </Button>,
      ]}
    >
      <h1>Update Post</h1>
      <Form
        form={form}
        initialValues={{ contentDescription: selectedPost.contentDescription }}
        onFinish={handleUpdate}
      >
        <Form.Item
          name="contentDescription"
          label="Content Description"
          rules={[
            { required: true, message: "Please enter content description" },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        {!imageUploading && (
        <Form.Item name="mediaLink" label="Media Link">
            <Upload
              accept="image/*,video/*"
              onChange={handleFileChange}
              showUploadList={false}
              beforeUpload={() => false}
              style={{ marginBottom: "1rem" }}
            >
              <Button icon={<UploadOutlined />}>Upload Media</Button>
            </Upload>
          </Form.Item>
        )}
      </Form>
      {imageUploading && <p>Please wait media is uploading</p>}
      {fileType === "image" && image && (
          <img
            src={image}
            alt="preview"
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              width: "100%",
              height: "auto",
              objectFit: "contain",
              marginBottom: "1rem",
            }}
          />
        )}
      {fileType === "video" && (
        <video controls src={image} style={{ maxHeight: 400, width: "100%" }} />
      )}
      <div style={{ height: 16 }} />
    </Modal>
  );
};

export default UploadPostModal;*/
