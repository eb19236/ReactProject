import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProject } from "../store/projectsSlice";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const ProjectsList = () => {
  const projects = useSelector((state) => state.projects.projects);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">הפרויקטים שלי</Typography>

        {/* כפתור שעובר לעמוד ההוספה  */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/AddProject")}
        >
          + פרויקט חדש
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {projects.map((project) => (
          <Card
            key={project.id}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/DetailsProject/${project.id}`)}
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h6">{project.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.description}
                </Typography>
              </Box>

              {/* כפתור מחיקה */}
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={(e) => {
                  // מונע מעבר לעמוד פרויקט כשלוחצים על מחיקה
                  dispatch(deleteProject(project.id));
                }}
              >
                מחק
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default ProjectsList;
