import React, { useState, useEffect } from "react";
import "./App.css";

// Sample video data (without hardcoded titles)
const videoData = [
  { id: 1, url: "https://www.youtube.com/watch?v=EfK0SURQ8X0" },
  { id: 2, url: "https://www.youtube.com/watch?v=fZCe_JY8oUI" },
  { id: 3, url: "https://www.youtube.com/watch?v=TUXh42V_ng4" },
  { id: 4, url: "https://www.youtube.com/watch?v=wI136NFVhl8" },
  { id: 5, url: "https://www.youtube.com/watch?v=QH44R1oOvOQ" },
  { id: 5, url: "https://www.youtube.com/watch?v=bDfOdFg5G1U" },
  { id: 5, url: "https://www.youtube.com/watch?v=22aj-5Pbev4" },
  { id: 5, url: "https://www.youtube.com/watch?v=8eVXTyIZ1Hs" },
  { id: 5, url: "https://www.youtube.com/watch?v=drtSveItdwg" },
  { id: 5, url: "https://www.youtube.com/watch?v=kfOBoEsvbuI" },
];

// Function to extract video ID from URL
const extractVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Function to fetch video details (title, thumbnail, etc.) using YouTube oEmbed API
const fetchVideoDetails = async (videoUrl) => {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${videoUrl}&format=json`
    );
    const data = await response.json();
    return data; // Returns { title, thumbnail_url, etc. }
  } catch (error) {
    console.error("Error fetching video details:", error);
    return null;
  }
};

const App = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });

  // Fetch titles for all videos when the component mounts
  useEffect(() => {
    const fetchAllTitles = async () => {
      const updatedVideos = await Promise.all(
        videoData.map(async (video) => {
          const details = await fetchVideoDetails(video.url);
          return {
            ...video,
            title: details ? details.title : "Unknown Title",
            thumbnail: `https://img.youtube.com/vi/${extractVideoId(video.url)}/0.jpg`,
          };
        })
      );
      setVideos(updatedVideos);
    };
    fetchAllTitles();
  }, []);

  // Handle video click
  const handleVideoClick = async (video) => {
    const videoDetails = await fetchVideoDetails(video.url);
    if (videoDetails) {
      setSelectedVideo({
        ...video,
        title: videoDetails.title, // Update the title dynamically
      });
    } else {
      setSelectedVideo(video); // Fallback to the hardcoded title
    }
  };

  // Handle title hover
  const handleTitleHover = (e, title) => {
    setTooltip({
      visible: true,
      text: title,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Handle title leave
  const handleTitleLeave = () => {
    setTooltip({ visible: false, text: "", x: 0, y: 0 });
  };

  return (
    <div className="app">
      {/* Title */}
      <h1 className="title">YouTube Video Player</h1>

      {/* Video Player */}
      <div className="video-player">
        {selectedVideo ? (
          <>
            <h2 className="video-title">{selectedVideo.title}</h2>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${extractVideoId(
                selectedVideo.url
              )}?autoplay=1`} // Autoplay enabled
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </>
        ) : (
          <div className="placeholder">Click on any video to play</div>
        )}
      </div>

      {/* Video Sections */}
      <div className="video-sections">
        {[1, 2, 3].map((section) => (
          <div key={section} className="section">
            <h2>Section {section}</h2>
            <div className="video-list">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="video-item"
                  onClick={() => handleVideoClick(video)}
                >
                  <img src={video.thumbnail} alt={video.title} />
                  <p
                    className="video-title"
                    onMouseEnter={(e) => handleTitleHover(e, video.title)}
                    onMouseLeave={handleTitleLeave}
                  >
                    {video.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="tooltip"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default App;