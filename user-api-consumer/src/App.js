import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css'

function App() {
  // State to store the users
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Using useEffect to fetch users from the API when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((response) => {
        setUsers(response.data); // Store the users in state
        setFilteredUsers(response.data); // Initially show all users
      })
      .catch((error) => {
        console.error("Error fetching users: ", error); // Log any errors
      });
  }, []); // The empty array means this effect runs only once when the component mounts

  // Function to filter users by name or email
  const handleSearch = (e) => {
    setSearch(e.target.value); // Update the search state

    // Filter the users based on the search field
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        user.email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered); // Update the filtered list
  };

  return (
    <div className="App">
      <h1>User List</h1>

      {/* Input to filter users */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={handleSearch} // Handle changes to the search input
      />

      {/* Display the list of users using map */}
      <ul>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li key={user._id}>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </li>
          ))
        ) : (
          <p>No users found</p> // Message when no users match the search
        )}
      </ul>
    </div>
  );
}

export default App;
