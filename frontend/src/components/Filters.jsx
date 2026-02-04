import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import {
  Box,
  Checkbox,
  FormLabel,
  IconButton,
  InputBase,
  Paper,
  RadioGroup,
} from "@mui/material";
// import { useProducts } from "../hooks/useProducts";

export default function Filters({ options, setOptions, brandList, typeList }) {
  const sortOptions = [
    { title: "Sorting Options", label: "Alphabetical", value: "name" },
    { title: "Choose Brand", label: "Price: Low to High", value: "price" },
    {
      title: "Choose Category",
      label: "Price: High to Low",
      value: "pricedesc",
    },
  ];

  const handleSortChange = (e) => {
    setOptions((prev) => ({ ...prev, sortBy: e.target.value }));
  };

  const handleBrandChange = (e) => {
    const { value, checked } = e.target;
    setOptions((prev) => {
      const newBrands = checked
        ? [...prev.brands, value]
        : prev.brands.filter((brand) => brand !== value);
      return { ...prev, brands: newBrands };
    });
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    setOptions((prev) => {
      const newTypes = checked
        ? [...prev.types, value]
        : prev.types.filter((type) => type !== value);
      return { ...prev, types: newTypes };
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* 2.sort by price */}
      <Paper sx={{ padding: 2 }}>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="name"
              name="radio-buttons-group"
              value={options.sortBy}
              onChange={handleSortChange}
            >
              {sortOptions.map((option) => (
                <FormControlLabel
                  key={option.label}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormLabel>
        </FormControl>
      </Paper>

      {/* 3.sort by brands */}
      <Paper sx={{ padding: 2 }}>
        <FormControl>
          {brandList.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option}
              label={option}
              control={<Checkbox />}
              onChange={handleBrandChange}
              checked={options.brands.includes(option)}
            />
          ))}
        </FormControl>
      </Paper>

      {/* 4.sort by types */}
      <Paper sx={{ padding: 2 }}>
        <FormControl>
          {typeList.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option}
              label={option}
              control={<Checkbox />}
              onChange={handleTypeChange}
              checked={options.types.includes(option)}
            />
          ))}
        </FormControl>
      </Paper>
    </Box>
  );
}
