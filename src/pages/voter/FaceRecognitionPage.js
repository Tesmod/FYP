// src/pages/FaceRecognitionPage.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";

const FaceRecognitionPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [matchedLabel, setMatchedLabel] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      startWebcam();
    };

    const startWebcam = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Camera error:", err));
    };

    loadModels();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const getLabeledFaceDescriptions = async () => {
    const labels = ["Ronaldo", "Farouq", "Data"];
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
          const img = await faceapi.fetchImage(`/labels/${label}/${i}.jpeg`);
          const detection = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          if (detection) {
            descriptions.push(detection.descriptor);
          }
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  };

  const onPlay = async () => {
    const labeledDescriptors = await getLabeledFaceDescriptions();
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);

    const canvas = faceapi.createCanvasFromMedia(videoRef.current);
    canvasRef.current.innerHTML = "";
    canvasRef.current.appendChild(canvas);

    const displaySize = {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
    };
    faceapi.matchDimensions(canvas, displaySize);

    intervalRef.current = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resized = faceapi.resizeResults(detections, displaySize);

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

      resized.forEach((detection) => {
        const match = faceMatcher.findBestMatch(detection.descriptor);
        const box = detection.detection.box;

        if (
          match.label !== "unknown" &&
          !modalVisible &&
          !matchedLabel // prevent repeat
        ) {
          setMatchedLabel(match.label);
          setModalVisible(true);
          clearInterval(intervalRef.current); // stop further detection
        }

        const drawBox = new faceapi.draw.DrawBox(box, {
          label: match.toString(),
        });
        drawBox.draw(canvas);
      });
    }, 100);
  };

  const handleProceed = () => {
    setModalVisible(false);
    navigate("/dashboard"); // or any route like "/vote"
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Live Facial Recognition</h2>
      <div style={{ position: "relative", display: "inline-block" }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          width="720"
          height="560"
          onPlay={onPlay}
          style={{ borderRadius: "10px" }}
        />
        <div ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
      </div>

      {/* MODAL */}
      {modalVisible && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h3>✅ Face Matched: {matchedLabel}</h3>
            <p>Welcome, {matchedLabel}. You may now proceed.</p>
            <button onClick={handleProceed} style={modalStyles.button}>
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    textAlign: "center",
    minWidth: "300px",
  },
  button: {
    marginTop: "1rem",
    padding: "10px 20px",
    fontSize: "16px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default FaceRecognitionPage;
