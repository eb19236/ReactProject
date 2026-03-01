import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { addProject } from "../store/projectsSlice";
import { Button, TextField, Container, Typography, Box } from "@mui/material";

const ProjectForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddProject = () => {
    if (!name.trim()) {
      alert("חובה להזין שם פרויקט");
      return;
    }

    const newProject = {
      id: Date.now(),
      name: name,
      description: description,
      createdAt: createdAt,
      tasks: [] 
    };

    dispatch(addProject(newProject));
    navigate("/ProjectsList"); 
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>הוספת פרויקט חדש</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, border: '1px solid #ccc', padding: 3, borderRadius: 2 }}>
        <TextField label="שם הפרויקט" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        <TextField label="תיאור" variant="outlined" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
        <TextField label="תאריך יצירה" type="date" InputLabelProps={{ shrink: true }} value={createdAt} onChange={(e) => setCreatedAt(e.target.value)} fullWidth />
        <Button variant="contained" color="primary" onClick={handleAddProject}>
          שמור פרויקט
        </Button>
      </Box>
    </Container>
  );
};

export default ProjectForm;