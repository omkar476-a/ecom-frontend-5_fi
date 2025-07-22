import React, { useEffect, useState } from "react";
import axios from "axios";

const WTPartsList = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/wrs/parts")
      .then((response) => {
        setParts(response.data.value || []);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch parts.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-5 pt-4">
      <h2 className="text-center mb-4">Windchill WTParts</h2>

      {loading && <p className="text-center">Loading parts...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {parts.length > 0 ? (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Number</th>
              <th>Name</th>
              <th>State</th>
              <th>Created On</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{part.Number}</td>
                <td>{part.Name}</td>
                <td>{part.State?.Display}</td>
                <td>
                  {part.CreatedOn
                    ? new Date(part.CreatedOn).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="text-center">No parts found.</p>
      )}
    </div>
  );
};

export default WTPartsList;
