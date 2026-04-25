import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { Button, Modal, Select } from "react-materialize";

const SubscribeUserPosts = () => {
  console.log("SubscribeUserPosts loaded"); // ✅ Confirm component loaded

  const [data, setData] = useState([]);
  const { state } = useContext(UserContext);
  const history = useHistory();
  const API = process.env.REACT_APP_API_URL;


  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [due, setDue] = useState("");
  const [github, setGithub] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");

  // ✅ Fetch all followed users' tickets
  useEffect(() => {
    fetch(`${API}/getsubpost`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Fetched team posts:", result);
        setData(result.posts || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const updateDetails = () => {
    fetch(`${API}/createpost`, {
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
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({
            html: "Ticket Submitted Successfully",
            classes: "#43a047 green darken-1",
          });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`${API}/deletepost/${postid}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => item._id !== result._id);
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="home">
      {data.length === 0 ? (
        <h4 style={{ textAlign: "center", marginTop: "40px" }}>
          No team tickets found — follow someone to view their tickets.
        </h4>
      ) : (
        data.map((item) => (
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
            <div className="card-content" style={{ textAlign: "center" }}>
              <h6>
                <strong>Status:</strong> {item.status}
              </h6>
              <h6>
                <strong>Deadline:</strong> {item.due}
              </h6>
              <h6>
                <strong>Source Code:</strong>{" "}
                <a href={item.github}>{item.github}</a>
              </h6>
              <h6>
                <strong>Severity:</strong> {item.severity}
              </h6>
              <h6>
                <strong>Team Members:</strong> {item.teamMembers}
              </h6>
              <h6>
                <strong>Summary:</strong> {item.body}
              </h6>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// ✅ Correct export name
export default SubscribeUserPosts;
