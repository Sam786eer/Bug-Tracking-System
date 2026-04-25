import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';
import 'materialize-css';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';
import { Button, Modal, Select } from 'react-materialize';

const Profile = () => {
  const [myPosts, setMyPosts] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  // Form states for update
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [due, setDue] = useState('');
  const [github, setGithub] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [severity, setSeverity] = useState('');
  const [status, setStatus] = useState('');
  const [currentId, setCurrentId] = useState('');
  const API = process.env.REACT_APP_API_URL;


  // Profile image
  const [image, setImage] = useState('');

  // Fetch user's tickets
  useEffect(() => {
    fetch(`${API}/mypost`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setMyPosts(result.mypost);
      })
      .catch((err) => console.log(err));
  }, []);

  
  const openUpdateModal = (ticket) => {
    setCurrentId(ticket._id);
    setTitle(ticket.title);
    setBody(ticket.body);
    setDue(ticket.due);
    setGithub(ticket.github || '');
    setTeamMembers(ticket.teamMembers);
    setSeverity(ticket.severity);
    setStatus(ticket.status);

    const elem = document.getElementById(`modal-${ticket._id}`);
    const instance = M.Modal.init(elem);
    instance.open();
  };

  //  UPDATE TICKET FUNCTION
  const updateDetails = () => {
    if (!currentId) return;

    fetch(`${API}/updatepost/${currentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
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
          M.toast({ html: data.error, classes: '#c62828 red darken-3' });
        } else {
          //  Update local state
          setMyPosts((prev) =>
            prev.map((item) => (item._id === data._id ? data : item))
          );

          M.toast({
            html: 'Ticket Updated Successfully!',
            classes: '#43a047 green darken-1',
          });

          //  Close modal after save
          const elem = document.getElementById(`modal-${currentId}`);
          const instance = M.Modal.getInstance(elem);
          if (instance) instance.close();
        }
      })
      .catch((err) => console.log(err));
  };

  //  DELETE POST
  const deletePost = (postid) => {
    fetch(`${API}/deletepost/${postid}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setMyPosts((prev) => prev.filter((item) => item._id !== result._id));
        M.toast({ html: 'Ticket Deleted!', classes: '#c62828 red darken-3' });
      })
      .catch((err) => console.log(err));
  };

  
  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', 'bugview');
      data.append('cloud_name', 'tk23');

      fetch('https://api.cloudinary.com/v1_1/tk23/image/upload', {
        method: 'POST',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("API VALUE:", API);
           console.log("UPDATE IMAGE URL:", `${API}/updateimage`);
          fetch(`${API}/updateimage`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
            body: JSON.stringify({ image: data.secure_url }),
          })
            .then((res) => res.json())
            .then((result) => {
              localStorage.setItem(
                'user',
                JSON.stringify({ ...state, image: result.image })
              );
              dispatch({ type: 'UPDATEIMAGE', payload: result.image });
            });
        })
        .catch((err) => console.log(err));
    }
  }, [image]);

  const updateImage = (file) => setImage(file);

  return (
    <div style={{ maxWidth: '1200px', margin: '0px auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          margin: '18px 0px',
          borderBottom: '2px solid grey',
        }}
      >
        <div>
          <img
            style={{
              width: '240px',
              height: '240px',
              borderRadius: '160px',
              margin: 'auto',
              display: 'block',
            }}
            src={state && state.image}
            alt="profile"
          />
          <div
            className="file-field input-field"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <div className="btn #64b5f6 blue darken-1">
              <span>Update Profile Picture</span>
              <input type="file" onChange={(e) => updateImage(e.target.files[0])} />
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h5>
            <strong>Name: </strong>
            {state && state.firstName} {state && state.lastName}
          </h5>
          <h5>
            <strong>Email: </strong>
            {state && state.email}
          </h5>
          <h5>
            <strong>Job Title: </strong>
            {state && state.jobTitle}
          </h5>
          <h5>
            <strong>{myPosts.length}</strong> Ticket(s) Posted
          </h5>
          <h5>
            <strong>{(state && state.following ? state.following.length : 0)}</strong> Associated Members
          </h5>
        </div>
      </div>

      {/*  All Tickets by User */}
      <div className="gallery">
        {myPosts.map((item) => (
          <div className="card home-card" key={item._id}>
            <div
              style={{
                textAlign: 'center',
                backgroundColor:
                  item.severity === 'High'
                    ? 'red'
                    : item.severity === 'Moderate'
                    ? 'green'
                    : 'yellow',
                height: '25px',
              }}
            >
              <span>
                <strong>Ticket #: </strong>
                {item._id}
              </span>
            </div>

            <h5 style={{ textAlign: 'center' }}>{item.title}</h5>

            <h6 style={{ textAlign: 'center' }}>
              <strong>Posted By: </strong>
              <Link
                to={
                  item.postedBy._id !== state._id
                    ? '/profile/' + item.postedBy._id
                    : '/profile'
                }
              >
                {item.postedBy.firstName} {item.postedBy.lastName}
              </Link>
              {item.postedBy._id === state._id && (
                <i
                  className="material-icons"
                  style={{ float: 'right', marginRight: '15px', cursor: 'pointer' }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              )}
            </h6>

            <h6 style={{ textAlign: 'center' }}>
              <strong>Posted At: </strong>
              {new Date(item.createdAt).toLocaleString()}
            </h6>
            <h6 style={{ textAlign: 'center' }}>
              <strong>Last Update: </strong>
              {new Date(item.updatedAt).toLocaleString()}
            </h6>

            <h6 style={{ textAlign: 'center' }}>
              <strong>Status: </strong>
              {item.status === 'Pending' ? '⌛' : '✔️'} {item.status}
            </h6>

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <Button onClick={() => openUpdateModal(item)}>Update Ticket</Button>
            </div>

            <h6>
              <strong>Deadline:</strong> {item.due}
            </h6>
            <h6>
              <strong>Source Code:</strong>{' '}
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

            {/*  UPDATE MODAL */}
            <Modal
              id={`modal-${item._id}`}
              actions={[
                <Button
                  flat
                  node="button"
                  waves="green"
                  onClick={updateDetails}
                >
                  Submit Ticket
                </Button>,
                <Button flat modal="close" node="button" waves="red">
                  Close
                </Button>,
              ]}
              header="Update Ticket"
              options={{ dismissible: true, preventScrolling: true }}
            >
              <div style={{ textAlign: 'center' }}>
                <input
                  type="text"
                  placeholder="Due Date"
                  value={due || item.due}
                  onChange={(e) => setDue(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={title || item.title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={body || item.body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="GitHub Link"
                  value={github || item.github}
                  onChange={(e) => setGithub(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Team Members"
                  value={teamMembers || item.teamMembers}
                  onChange={(e) => setTeamMembers(e.target.value)}
                />
                <Select
                  value={severity || item.severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option value="High">🔴 High</option>
                  <option value="Moderate">🟢 Moderate</option>
                  <option value="Low">🟡 Low</option>
                </Select>
                <Select
                  value={status || item.status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">⌛ Pending</option>
                  <option value="Completed">✔️ Completed</option>
                </Select>
              </div>
            </Modal>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
