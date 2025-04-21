import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Image, Spinner } from "react-bootstrap";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

const UserProfile = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get("/api/users/profile", config);
        setName(data.name);
        setEmail(data.email);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage("Failed to fetch profile.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreviewPic(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (password && password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const body = {
        name,
        ...(password && { password }), // send password only if it's entered
      };

      const { data } = await axios.put("/api/users/profile", body, config);
      setMessage("✅ Profile updated successfully!");
      setLoading(false);
    } catch (error) {
      setMessage("Error updating profile.");
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow-sm">
            <h3 className="text-center text-primary mb-3">👤 User Profile</h3>

            {message && <Alert variant={message.includes("✅") ? "success" : "danger"}>{message}</Alert>}
            {loading && (
              <div className="text-center mb-3">
                <Spinner animation="border" />
              </div>
            )}

            <div className="text-center mb-4">
              {previewPic ? (
                <Image src={previewPic} roundedCircle width={100} height={100} />
              ) : (
                <FaUserCircle size={100} className="text-secondary" />
              )}
              <Form.Group controlId="formFile" className="mt-2">
                <Form.Control type="file" onChange={handlePicChange} />
              </Form.Group>
            </div>

            <Form>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" value={email} disabled />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>

              <div className="text-center">
                <Button variant="primary" onClick={handleSave} disabled={loading}>
                  Save Changes
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
