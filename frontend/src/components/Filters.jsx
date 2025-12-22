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
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

export default function Filters({ filters, setFilters, brandList, typeList }) {
  const sortOptions = [
    { label: "Name", value: "name" },
    { label: "Price: Low to High", value: "price" },
    { label: "Price: High to Low", value: "pricedesc" },
  ];

  const [searchInput, setSearchInput] = useState(filters.searchTerm || "");
  const handleSearchInputChange = (e) => {
    // just update the local input state, not the filter yet,so it doesn't trigger api call
    setSearchInput(e.target.value);
    // when input is cleared, also clear the searchTerm filter to show all products!!!!!!!!!!
    if (e.target.value === "") {
      // if the input is cleared, then clear the searchTerm filter to show all products
      setFilters((prev) => ({ ...prev, searchTerm: "" }));
    }
  };

  const handleKeyDown = (e) => {
    // when user press enter key--then set the search term filter--then it triggers the api call
    if (e.key === "Enter") {
      setFilters((prev) => ({ ...prev, searchTerm: searchInput }));
    }
  };
  const handleSearchClick = () => {
    // when user click search button--then set the search term filter--then it triggers the api call
    setFilters((prev) => ({ ...prev, searchTerm: searchInput }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value }));
  };

  const handleBrandChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prev) => {
      const newBrands = checked
        ? [...prev.brands, value]
        : prev.brands.filter((brand) => brand !== value);
      return { ...prev, brands: newBrands };
    });
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prev) => {
      const newTypes = checked
        ? [...prev.types, value]
        : prev.types.filter((type) => type !== value);
      return { ...prev, types: newTypes };
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* 1.search  */}
      {/*  after user press enter or click search button,change the search term filter, finally triggers the api call */}
      <Paper sx={{ display: "flex", alignItems: "center" }}>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Products"
          inputProps={{ "aria-label": "search products" }}
          value={searchInput}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyDown}
        />

        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={handleSearchClick}
        >
          <SearchIcon />
        </IconButton>
      </Paper>

      {/* 2.sort by price */}
      <Paper sx={{ padding: 2 }}>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="name"
              name="radio-buttons-group"
              value={filters.sortBy}
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
              checked={filters.brands.includes(option)}
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
              checked={filters.types.includes(option)}
            />
          ))}
        </FormControl>
      </Paper>
    </Box>
  );
}
