/* eslint-disable react/prop-types */
import { Select, MenuItem, TextField, Button } from "@mui/material";
import { Clear } from "@mui/icons-material";

const EventFilters = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedDate,
  setSelectedDate,
}) => {
  // ✅ Function to clear filters
  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedDate("");
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        displayEmpty
        sx={{
          minWidth: 180,
          height: 40,
          backgroundColor: "white",
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            height: "40px", // ✅ Ensures proper height
          },
        }}
      >
        <MenuItem value="">All Categories</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </Select>

      <TextField
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }} // ✅ Fixed deprecated prop
        sx={{
          minWidth: 180,
          backgroundColor: "white",
          "& .MuiInputBase-root": {
            height: "40px", // ✅ Ensures the container has the same height
          },
          "& input": {
            height: "40px", // ✅ Ensures the actual input field has the same height
            padding: "10px", // ✅ Adjust padding to match the Select component
          },
        }}
      />

      {/* ✅ Clear Filters Button with Matching Height */}
      {selectedCategory || selectedDate ? (
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<Clear />}
          onClick={handleClearFilters}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            height: 40,
            display: "flex",
            alignItems: "center",
          }}
        >
          Clear Filters
        </Button>
      ) : null}
    </div>
  );
};

export default EventFilters;
