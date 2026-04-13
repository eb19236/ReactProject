import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { addProject } from "../store/projectsSlice";
import { Button, TextField, Container, Typography, Box } from "@mui/material";


 //ProjectForm - קומפוננטה ליצירת פרויקט חדש.
 
const ProjectForm = () => {
  // --- ניהול סטייט מקומי לשדות הטופס ---
  const [name, setName] = useState("");          // שם הפרויקט
  const [description, setDescription] = useState("");  // תיאור הפרויקט
  const [createdAt, setCreatedAt] = useState("");      // תאריך יצירה

  const dispatch = useDispatch(); 
  const navigate = useNavigate();

  
   //handleAddProject - פונקציה המופעלת בלחיצה על "שמור פרויקט"
   
  const handleAddProject = () => {
    // בדיקה ששם הפרויקט אינו ריק
    if (!name.trim()) {
      alert("חובה להזין שם פרויקט");
      return;
    }

    // יצירת אובייקט פרויקט חדש
    const newProject = {
      id: Date.now(),
      name: name,
      description: description,
      createdAt: createdAt,
      tasks: [] // פרויקט חדש נוצר תמיד עם רשימת משימות ריקה
    };

    // עדכון ה-Store ב-Redux
    dispatch(addProject(newProject));

    // ניווט אוטומטי חזרה לרשימת הפרויקטים לאחר השמירה
    navigate("/ProjectsList"); 
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
      
      <Typography variant="h4" gutterBottom>
        הוספת פרויקט חדש
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2, 
        border: '1px solid #ccc', 
        padding: 3, 
        borderRadius: 2,
        boxShadow: 1 
      }}>
        
        <TextField 
          label="שם הפרויקט" 
          variant="outlined" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          fullWidth 
        />

        <TextField 
          label="תיאור" 
          variant="outlined" 
          multiline 
          rows={3} 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          fullWidth 
        />

        <TextField 
          label="תאריך יצירה" 
          type="date" 
          // shrink: true גורם לתווית לא לעלות על התאריך ב-Chrome
          InputLabelProps={{ shrink: true }} 
          value={createdAt} 
          onChange={(e) => setCreatedAt(e.target.value)} 
          fullWidth 
        />

        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={handleAddProject}
          sx={{ mt: 1 }}
        >
          שמור פרויקט
        </Button>

      </Box>
    </Container>
  );
};

export default ProjectForm;