import { useEffect, useState } from "react";

function TestConnection() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/test`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Cannot connect to backend!"));
  }, []);

  return (
    <div>
      <h2>Connection Test</h2>
      <p>{message}</p>
    </div>
  );
}

export default TestConnection;
