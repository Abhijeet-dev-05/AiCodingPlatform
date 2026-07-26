import { useParams, Link } from 'react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';
import './AdminUpload.css';

function AdminUpload() {
  const { problemId } = useParams();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Upload video to Cloudinary
  const onSubmit = async (data) => {
    const file = data.videoFile[0];

    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      // Step 1: Get upload signature from backend
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

      // Step 2: Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);
      formData.append('resource_type', 'video');

      // Step 3: Upload directly to Cloudinary with chunk support
      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      // Step 4: Save video metadata to backend
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset(); // Reset form after successful upload

    } catch (err) {
      console.error('Upload error:', err);
      setError('root', {
        type: 'manual',
        message: err.response?.data?.error || 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="admin-upload-page">
      {/* Back Button - Top Left */}
      <Link to="/admin/video" className="admin-upload-back-btn">
        ← Back to Videos
      </Link>

      {/* Page Header - Centered */}
      <div className="admin-upload-header">
        <span>📤</span>
        <h1>Upload Video</h1>
      </div>

      {/* Upload Card - Centered */}
      <div className="admin-upload-card">
        <h2>🎬 Upload Solution Video</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="admin-upload-form">
          {/* File Input */}
          <div className="file-input-group">
            <label>Choose video file</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="video/*"
                {...register('videoFile', {
                  required: 'Please select a video file',
                  validate: {
                    isVideo: (files) => {
                      if (!files || !files[0]) return 'Please select a video file';
                      const file = files[0];
                      return file.type.startsWith('video/') || 'Please select a valid video file';
                    },
                    fileSize: (files) => {
                      if (!files || !files[0]) return true;
                      const file = files[0];
                      const maxSize = 1024 * 1024 * 1024; // 1GB
                      return file.size <= maxSize || 'File size must be less than 1GB';
                    }
                  }
                })}
                className={`custom-file-input ${errors.videoFile ? 'input-error' : ''}`}
                disabled={uploading}
              />
            </div>
            {errors.videoFile && (
              <span className="error-text">{errors.videoFile.message}</span>
            )}
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="file-info-card">
              <div className="file-info-icon">🎥</div>
              <div className="file-info-details">
                <h4>{selectedFile.name}</h4>
                <p>Size: {formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="progress-container">
              <div className="progress-header">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.root && (
            <div className="alert alert-error">
              <span className="alert-icon">❌</span>
              <div className="alert-content">
                <h4>Upload Failed</h4>
                <p>{errors.root.message}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {uploadedVideo && (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              <div className="alert-content">
                <h4>Upload Successful!</h4>
                <p>Duration: {formatDuration(uploadedVideo.duration)}</p>
                <p>Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="submit-btn"
          >
            {uploading ? (
              <>
                <span className="spinner"></span>
                Uploading...
              </>
            ) : (
              <>📤 Upload Video</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminUpload;