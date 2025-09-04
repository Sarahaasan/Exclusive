import { useState, useEffect } from "react";
import "../css/Profile.css";

const Profile = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [message, setMessage] = useState("");

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://exclusive.runasp.net/api/Account/profile", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }
        });
        const data = await res.json();
        if (res.ok && data.succeeded) {
          setFormData({
            firstName: data.data.firstName || "",
            lastName: data.data.lastName || "",
            email: data.data.email || "",
            address: data.data.address || "",
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: ""
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    try {
      const res = await fetch("https://exclusive.runasp.net/api/Account/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmNewPassword
        })
      });

      const result = await res.json();
      if (res.ok) {
        setMessage("Profile updated / Password changed successfully ✅");
        
        setFormData({ ...formData, currentPassword: "", newPassword: "", confirmNewPassword: "" });
      } else {
        setMessage(result.message || "Failed to update profile ❌");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div className="profile-container">
      <aside className="sidebar">
        <h3>Manage My Account</h3>
        <ul>
          <li>
            <a href="" onClick={(e) => { e.preventDefault(); setShowForm(true); }}>
              My Profile
            </a>
          </li>
          <li>Address Book</li>
          <li>My Payment Options</li>
        </ul>

        <h3>My Orders</h3>
        <ul>
          <li>My Returns</li>
          <li>My Cancellations</li>
        </ul>

        <h3>My WishList</h3>
      </aside>

      {showForm && (
        <main className="profile-form">
          <h2>Edit Your Profile</h2>

          {message && <p className="message">{message}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <h4>Password Changes</h4>
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={formData.currentPassword}
              onChange={handleChange}
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
            />

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </div>
          </form>
        </main>
      )}
    </div>
  );
};

export default Profile;
