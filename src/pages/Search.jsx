import { useEffect, useState } from "react";

import '/src/pages/SearchStyles.css'
import '/src/pages/HomeStyles.css'

import BottomNav from "../components/BottomNav"

import TextField from "@mui/material/TextField"
import { CircularProgress } from "@mui/material";
// import InputAdornment from "@mui/material/InputAdornment"
import SearchIcon from "@mui/icons-material/Search"
import Fuse from "fuse.js"

export default function Search() {
    const [shows, setShows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    // const [showGenres, setShowGenres] = useState([]);
    const [isLoading,setIsLoading] = useState(true)
  
    useEffect(() => {
      
      fetch('https://podcast-api.netlify.app/shows')
        .then((res) => res.json())
        .then((data) => {
            setShows(data);
            setIsLoading(false)
        })
        .catch((error) => console.log(error))
    }, []);


    // const getGenreName = (genreId) => {
    //     const genre = showGenres.find((genre) => genre.id === genreId);
    //     return genre ? genre.name : '';
    // };

    // get genres using the show id: https://podcast-api.netlify.app/id/{show.id}
    /*useEffect(() => {
        if (shows.length > 0) {
        fetch(`https://podcast-api.netlify.app/id/${shows[0].id}`) 
        .then((res) => res.json())
        .then((data) => {
            setShowGenres(data)
        })
        .catch((error) => console.log(error))

}}, [shows]*/

  
    const handleInputChange = (event) => {
      setSearchTerm(event.target.value);

    };

   
  
    const handleSearch = () => {
      setIsLoading(true)
      const fuse = new Fuse(shows, {
        keys: [
            'title', 'id', 'description', 'updated'],
      });
  
      const searchResults = fuse.search(searchTerm);
      setSearchResults(searchResults);
      console.log(searchResults);
      setIsLoading(false)
    };
  
    

    return (
      <div className="search--page">
        
        <p className="search--header">
          Search For The Next <strong>Best Podcast</strong> You Have Ever Heard
        </p>
  
        <div className="search--input">
          <TextField
            className="home--search-field"
            color="secondary"
            placeholder="Search"
            size="large"
            variant="standard"
            
            value={searchTerm}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: 
              <SearchIcon 
                onClick={handleSearch}
              />
              
            }}
          />
          
        </div>
            
        {isLoading ? (
                <div className="loading">
                <CircularProgress color="secondary" /> 
                </div>
            ) : (
            <>     
        {searchResults.length > 0 && (
            
          <div className="search--results">
              {searchResults.map((result) => (
                
                <div key={result.item.id} className="search--results-cards">
                    <header className="search--results-header">
                        <img src={result.item.image} alt="podcast-image" className="search--results-image"/>
                        <p className="search--results-updated">{new Date(result.item.updated).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}  
                        </p>
                        <span className="search--results-title">{result.item.title.replace(/&amp;/g, " & ")}</span>
                    </header>
                    {/* <p className="search--results-genres">Genres: {result.item.genres.map((genreId) => getGenreName(genreId)).join(", ")}</p> */}
                    {/* add ellipsis to description if too long */}

                    <div className="search--results-text">
                        
                        <p className="search--results-description">{result.item.description}  </p>
                        
                    </div>
                    
                </div>
                
              ))}
            </div>
        )}
        </>
        )}
        
  
        <BottomNav />
      </div>
      
    );
  }