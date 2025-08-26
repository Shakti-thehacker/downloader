let selectedType = "";

function showInput(type) {
  selectedType = type;
  document.getElementById("input-box").style.display = "flex";
  document.getElementById("status").innerText = `Selected: ${type}`;
}

async function downloadFile() {
  const url = document.getElementById("fileLink").value;
  const status = document.getElementById("status");

  if (!url) {
    status.innerText = "⚠️ Please paste a valid link.";
    return;
  }

  status.innerText = "⏳ Downloading...";

  try {
    // call backend function
    const response = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error("Download failed");
    }

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = url.split("/").pop() || "file";
    link.click();

    status.innerText = "✅ Download started!";
  } catch (err) {
    status.innerText = "❌ Download failed!";
    console.error(err);
  }
}
