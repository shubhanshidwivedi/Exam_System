export default function CameraPreview({ stream }) {
  if (!stream) return null;

  return (
    <video
      autoPlay
      muted
      ref={(video) => {
        if (video && stream) video.srcObject = stream;
      }}
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        width: 200,
        border: "2px solid black",
        borderRadius: 6,
      }}
    />
  );
}
