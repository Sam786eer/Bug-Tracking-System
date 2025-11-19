import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import M from "materialize-css";
import { Button, Modal } from "react-materialize";

const AllTickets = () => {
  const [data, setData] = useState([]);
  const { state } = useContext(UserContext);

  // Controlled form states
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [due, setDue] = useState("");
  const [github, setGithub] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [language, setLanguage] = useState("");
  const [framework, setFramework] = useState("");
  const [currentId, setCurrentId] = useState("");

  const modalRef = useRef(null);

  //  Initialize Materialize modal once
  useEffect(() => {
    if (modalRef.current) {
      M.Modal.init(modalRef.current);
    }
  }, []);

  //  Fetch all posts
  useEffect(() => {
    fetch("/allpost", {
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
    })
      .then((res) => res.json())
      .then((result) => setData(result.posts || []))
      .catch((err) => console.log(err));
  }, []);

  //  Open modal & load data
  const openUpdateModal = (ticket) => {
    setCurrentId(ticket._id);
    setTitle(ticket.title || "");
    setBody(ticket.body || "");
    setDue(ticket.due || "");
    setGithub(ticket.github || "");
    setTeamMembers(ticket.teamMembers || "");
    setSeverity(ticket.severity || "");
    setStatus(ticket.status || "");
    setLanguage(ticket.language || "");
    setFramework(ticket.framework || "");

    const modalInstance = M.Modal.getInstance(modalRef.current);
    modalInstance.open();
  };

  //  Update ticket
  const updateDetails = () => {
    if (!currentId) return;

    fetch(`/updatepost/${currentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        title,
        body,
        due,
        github,
        teamMembers,
        severity,
        status,
        language,
        framework,
      }),
    })
      .then((res) => res.json())
      .then((updatedPost) => {
        if (updatedPost.error) {
          M.toast({ html: updatedPost.error, classes: "#c62828 red darken-3" });
        } else {
          setData((prevData) =>
            prevData.map((item) =>
              item._id === updatedPost._id ? updatedPost : item
            )
          );

          const modalInstance = M.Modal.getInstance(modalRef.current);
          modalInstance.close();

          M.toast({
            html: "✅ Ticket Updated Successfully",
            classes: "#43a047 green darken-1",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  //  Delete post
  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData((prevData) => prevData.filter((item) => item._id !== result._id));
        M.toast({ html: "Ticket Deleted", classes: "#c62828 red darken-3" });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div
        style={{
          fontSize: "40px",
          textAlign: "center",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      >
        <strong>Ticket History</strong>
      </div>

      <div className="home">
        {data.map((item) => (
          <div className="card home-card" key={item._id}>
            <div
              style={{
                textAlign: "center",
                backgroundColor:
                  item.severity === "High"
                    ? "red"
                    : item.severity === "Moderate"
                    ? "green"
                    : item.severity === "Low"
                    ? "yellow"
                    : null,
                height: "25px",
              }}
            >
              <span>
                <strong>Ticket #: </strong>
                {item._id}
              </span>
            </div>

            <h5 style={{ textAlign: "center" }}>{item.title}</h5>

            <h6 style={{ textAlign: "center" }}>
              <strong>Posted By:</strong>{" "}
              <Link
                to={
                  item.postedBy._id !== state._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile"
                }
              >
                {item.postedBy.firstName} {item.postedBy.lastName}
              </Link>
              {item.postedBy._id === state._id && (
                <i
                  className="material-icons"
                  style={{ float: "right", marginRight: "15px" }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              )}
            </h6>

            <div className="card-content">
              <h6>
                <strong>Posted At:</strong>{" "}
                {item.createdAt.toString().slice(11, 19)}{" "}
                {item.createdAt.toString().slice(0, 10)}
              </h6>
              <h6>
                <strong>Last Update:</strong>{" "}
                {item.updatedAt.toString().slice(11, 19)}{" "}
                {item.updatedAt.toString().slice(0, 10)}
              </h6>

              <h6 style={{ textAlign: "center", marginTop: "10px" }}>
                <strong>Status:</strong>{" "}
                {item.status === "Pending" ? "⌛ Pending" : "✔️ Completed"}
              </h6>

              {item.postedBy._id === state._id && (
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  <Button onClick={() => openUpdateModal(item)}>
                    Update Ticket
                  </Button>
                </div>
              )}

              <h6>
                <strong>Deadline:</strong> {item.due}
              </h6>
              <h6>
                <strong>Source Code:</strong>{" "}
                <a href={item.github} target="_blank" rel="noopener noreferrer">
                  {item.github}
                </a>
              </h6>
              <h6>
                <strong>Severity:</strong> {item.severity}
              </h6>
              <h6>
                <strong>Team Members:</strong> {item.teamMembers}
              </h6>
              <h6>
                <strong>Ticket Summary:</strong> {item.body}
              </h6>
            </div>
          </div>
        ))}
      </div>

      {/*  Update Modal */}
      <div id="update-modal" className="modal" ref={modalRef}>
        <div className="modal-content" style={{ textAlign: "center" }}>
          <h4>Update Ticket</h4>
          <input
            type="text"
            placeholder="Due Date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <input
            type="text"
            placeholder="GitHub Link"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
          <input
            type="text"
            placeholder="Team Members"
            value={teamMembers}
            onChange={(e) => setTeamMembers(e.target.value)}
          />
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="High">🔴 High</option>
            <option value="Moderate">🟢 Moderate</option>
            <option value="Low">🟡 Low</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Pending">⌛ Pending</option>
            <option value="Completed">✔️ Completed</option>
          </select>
        </div>

        <div className="modal-footer">
          <Button onClick={updateDetails} className="green">
            Submit Ticket
          </Button>
          <Button modal="close" className="red">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AllTickets;
