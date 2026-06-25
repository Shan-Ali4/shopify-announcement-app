import { useState } from "react";

export default function Index() {
  const [announcement, setAnnouncement] = useState("");

  const saveAnnouncement = async () => {
    try {
      const response = await fetch("/api/announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: announcement,
        }),
      });

      const data = await response.json();

      console.log(data);

      alert("Saved Successfully");
    } catch (error) {
      console.error(error);
      alert("Error saving announcement");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Announcement Manager</h1>

      <input
        value={announcement}
        onChange={(e) => setAnnouncement(e.target.value)}
        placeholder="Announcement Text"
        style={{
          width: "300px",
          padding: "10px",
        }}
      />

      <br />
      <br />

      <button onClick={saveAnnouncement}>
        Save
      </button>
    </div>
  );
}