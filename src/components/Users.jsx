import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosPrivate.get("/users", {
          signal: controller.signal,
        });

        if (isMounted) {
          setUsers(response.data);
        }
      } catch (err) {
        // Ignore abort errors (component unmounted)
        if (err.name === "CanceledError" || err.name === "AbortError") {
          return;
        }

        console.error("Error fetching users:", err);

        // Handle authentication errors
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login", { state: { from: location }, replace: true });
          return;
        }

        // Handle other errors
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to fetch users");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, navigate, location]);

  // Render loading state
  if (loading) {
    return (
      <article>
        <h2>Users List</h2>
        <p>Loading users...</p>
      </article>
    );
  }

  // Render error state
  if (error) {
    return (
      <article>
        <h2>Users List</h2>
        <p className="error">Error: {error}</p>
      </article>
    );
  }

  // Render users list
  return (
    <article>
      <h2>Users List</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id || user.username}>{user.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  );
};

export default Users;
