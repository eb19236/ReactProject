import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProject, updateProject } from "../store/projectsSlice"; 
import { Button, Card, CardContent, Typography, Box, Container } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';


//ProjectsList - קומפוננטה המציגה את רשימת כל הפרויקטים.
//מאפשרת ניווט לפרטי פרויקט, עריכה מהירה ומחיקה.
 
const ProjectsList = () => {
  // שליפת מערך הפרויקטים מה-Redux Store
  const projects = useSelector((state) => state.projects.projects);
  const dispatch = useDispatch();
  const navigate = useNavigate();
   
  const handleEditProject = (e, project) => {
    e.stopPropagation(); 

    const newName = prompt("ערוך שם פרויקט:", project.name);
    if (newName === null) return; // המשתמש לחץ על ביטול

    const newDescription = prompt("ערוך תיאור פרויקט:", project.description);
    if (newDescription === null) return;

    // שליחת העדכון ל-Store
    dispatch(updateProject({ 
      id: project.id, 
      name: newName, 
      description: newDescription 
    }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* כותרת העמוד וכפתור הוספה */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4">הפרויקטים שלי</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate("/AddProject")}
        >
          + פרויקט חדש
        </Button>
      </Box>

      {/* רשימת הכרטיסים */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {projects.map((project) => (
          <Card 
            key={project.id} 
            sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} // אפקט מעבר עכבר
            onClick={() => navigate(`/DetailsProject/${project.id}`)}
          >
            <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
              
              {/* הצגת פרטי הפרויקט */}
              <Box sx={{ flex: 1, textAlign: 'right' }}>
                <Typography variant="h6">{project.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.description}
                </Typography>
              </Box>
              
              {/* כפתורי פעולה - עריכה ומחיקה */}
              <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<EditIcon />} 
                  onClick={(e) => handleEditProject(e, project)}
                >
                  ערוך
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<DeleteIcon />} 
                  onClick={(e) => { 
                    e.stopPropagation(); // מניעת ניווט לעמוד פרטים בעת מחיקה
                    if(window.confirm("למחוק את הפרויקט?")) {
                      dispatch(deleteProject(project.id)); 
                    }
                  }}
                >
                  מחק
                </Button>
              </Box>

            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default ProjectsList;