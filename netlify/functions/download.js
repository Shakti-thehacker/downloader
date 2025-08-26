// netlify/functions/download.js
exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body || "{}");
    const url = data.url;
    if (!url) return { statusCode: 400, body: "Missing URL" };

    const fetchResponse = await fetch(url);
    if (!fetchResponse.ok) {
      return { statusCode: fetchResponse.status, body: "Failed to fetch the file" };
    }

    const arrayBuffer = await fetchResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = url.split("/").pop() || "file";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": fetchResponse.headers.get("content-type") || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
      isBase64Encoded: true,
      body: buffer.toString("base64"),
    };
  } catch (err) {
    return { statusCode: 500, body: "Server error: " + err.message };
  }
};
