import { useState, useRef, useEffect } from 'react';
import { Pause, Play, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import './Editorial.css';

const Editorial = ({ secureUrl, thumbnailUrl, duration, problemTitle }) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(duration || 0);
  const [isHovering, setIsHovering] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * videoDuration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Show controls on mouse move
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  // Update current time during playback
  useEffect(() => {
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (video) {
        setVideoDuration(video.duration);
        setIsLoading(false);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('canplay', handleCanPlay);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const progressPercent = videoDuration ? (currentTime / videoDuration) * 100 : 0;

  return (
    <div className="editorial-container">
      {/* Header Section */}
      <div className="editorial-header">
        <div className="editorial-icon">🎬</div>
        <div className="editorial-title-section">
          <h2 className="editorial-title">Video Editorial</h2>
          {problemTitle && (
            <p className="editorial-subtitle">{problemTitle}</p>
          )}
        </div>
      </div>

      {/* Video Player Container */}
      <div 
        className="video-player-wrapper"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          if (isPlaying) setShowControls(false);
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="video-loading-overlay">
            <div className="video-loader"></div>
          </div>
        )}

        {/* Play Button Overlay (when paused) */}
        {!isPlaying && !isLoading && (
          <div className="video-play-overlay" onClick={togglePlayPause}>
            <div className="play-button-large">
              <Play size={48} fill="white" />
            </div>
          </div>
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          src={secureUrl}
          poster={thumbnailUrl}
          onClick={togglePlayPause}
          className="editorial-video"
          preload="metadata"
        />
        
        {/* Video Controls Overlay */}
        <div className={`video-controls ${showControls || !isPlaying ? 'visible' : ''}`}>
          {/* Progress Bar */}
          <div 
            className="progress-bar-container"
            ref={progressRef}
            onClick={handleSeek}
          >
            <div className="progress-bar-track">
              <div 
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
              <div 
                className="progress-bar-thumb"
                style={{ left: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Controls Row */}
          <div className="controls-row">
            {/* Left Controls */}
            <div className="controls-left">
              <button
                onClick={togglePlayPause}
                className="control-btn play-pause-btn"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <button
                onClick={handleRestart}
                className="control-btn"
                aria-label="Restart"
              >
                <RotateCcw size={18} />
              </button>

              {/* Volume Controls */}
              <div className="volume-container">
                <button
                  onClick={toggleMute}
                  className="control-btn"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>

              {/* Time Display */}
              <span className="time-display">
                {formatTime(currentTime)} / {formatTime(videoDuration)}
              </span>
            </div>

            {/* Right Controls */}
            <div className="controls-right">
              <button
                onClick={handleFullscreen}
                className="control-btn"
                aria-label="Fullscreen"
              >
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info Section */}
      <div className="video-info-section">
        <div className="video-info-item">
          <span className="info-label">Duration</span>
          <span className="info-value">{formatTime(videoDuration)}</span>
        </div>
        <div className="video-info-divider"></div>
        <div className="video-info-item">
          <span className="info-label">Type</span>
          <span className="info-value">Solution Walkthrough</span>
        </div>
      </div>

      {/* Description */}
      <div className="editorial-description">
        <p>
          Watch this comprehensive video explanation to understand the optimal approach, 
          time complexity analysis, and step-by-step solution breakdown.
        </p>
      </div>
    </div>
  );
};

export default Editorial;