import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addProject } from "../store/projectsSlice"; 
import { TextField, Button, Box, Typography, Paper, Divider } from "@mui/material";

const ProjectForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(addProject({
      id: Date.now(),
      name: data.name,
      description: data.description,
      createdDate: data.createdDate || new Date().toISOString().split('T')[0],
      tasks: [] 
    }));
    reset();
  };

  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", p: 2 }}>
      {/*  הוספת פרויקט */}
      <Paper elevation={3} sx={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h6" gutterBottom>הוספת פרויקט חדש</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="שם הפרויקט" {...register("name", { required: "חובה" })} error={!!errors.name} />
          <TextField label="תיאור" multiline rows={3} {...register("description")} />
          <TextField label="תאריך יצירה" type="date" InputLabelProps={{ shrink: true }} {...register("createdDate")} />
          <Button type="submit" variant="contained">שמור פרויקט</Button>
        </Box>
      </Paper>

     
    </Box>
  );
};

export default ProjectForm;