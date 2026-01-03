// ====================================================================
// JAMIFY STUDIO - JAVASCRIPT FOR ITUNES & MUSICBRAINZ API INTEGRATION
// ====================================================================

// Wait for the DOM to fully load before running any code
document.addEventListener('DOMContentLoaded', () => {
    
    // ====================================================================
    // GET ALL HTML ELEMENTS WE NEED
    // ====================================================================
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    const clearBtn = document.querySelector('.clear-btn');
    const artistNameSpan = document.getElementById('artistName');
    const resultsContent = document.querySelector('.results-content');
    const historyContent = document.querySelector('.history-content');

    // ====================================================================
    // TRACK CURRENTLY PLAYING MEDIA
    // ====================================================================
    let currentAudio = null;

    // ====================================================================
    // SEARCH HISTORY STORAGE KEY
    // ====================================================================
    const STORAGE_KEY = 'jamifySearchHistory';

    // ====================================================================
    // LOAD SEARCH HISTORY FROM LOCALSTORAGE
    // ====================================================================
    function loadHistory() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        
        try {
            return JSON.parse(raw);
        } catch {
            return [];
        }
    }

    // ====================================================================
    // SAVE SEARCH HISTORY TO LOCALSTORAGE
    // ====================================================================
    function saveHistory(history) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }

    // ====================================================================
    // ADD SEARCH TERM TO HISTORY (PREVENTS DUPLICATES)
    // ====================================================================
    function addToHistory(term) {
        let history = loadHistory();
        
        // Remove if already exists (to move it to front)
        history = history.filter(item => item.toLowerCase() !== term.toLowerCase());
        
        // Add to beginning of array
        history.unshift(term);
        
        // Keep only last 10 searches
        history = history.slice(0, 10);
        
        saveHistory(history);
        displaySearchHistory();
    }

    // ====================================================================
    // DISPLAY SEARCH HISTORY BELOW RESULTS TITLE
    // ====================================================================
    function displaySearchHistory() {
        // Find or create history container
        let historyContainer = document.getElementById('searchHistoryContainer');
        
        if (!historyContainer) {
            // Create container if it doesn't exist
            historyContainer = document.createElement('div');
            historyContainer.id = 'searchHistoryContainer';
            
            // Insert after the results title
            const resultsTitle = document.querySelector('.results-title');
            resultsTitle.insertAdjacentElement('afterend', historyContainer);
        }
        
        const history = loadHistory();
        
        // Clear container
        historyContainer.innerHTML = '';

        // Show counter only if there's history
    if (history.length > 0) {
        const counter = document.createElement('span');
        counter.className = 'history-counter';
        counter.textContent = `${history.length} out of 10`;
        
        // Add warning only at 9 out of 10
        if (history.length === 9) {
            const warning = document.createElement('span');
            warning.className = 'history-warning';
            warning.textContent = 'You only get to keep 10 history views.';
            counter.appendChild(warning);
        }
        
        historyContainer.appendChild(counter);
    }
        
        // Create clickable history items
        history.forEach(term => {
            const historyItem = document.createElement('span');
            historyItem.className = 'search-history-item';
            historyItem.textContent = term;
            
            // Click to search again
            historyItem.addEventListener('click', () => {
                searchInput.value = term;
                searchBtn.click();
            });
            
            historyContainer.appendChild(historyItem);
        });
    }

    // ====================================================================
    // CLEAR SEARCH HISTORY FROM LOCALSTORAGE
    // ====================================================================
    function clearHistory() {
        localStorage.removeItem(STORAGE_KEY);
        const historyContainer = document.getElementById('searchHistoryContainer');
        if (historyContainer) {
            historyContainer.innerHTML = '';
        }
    }

    // ====================================================================
    // SEARCH BUTTON CLICK EVENT
    // ====================================================================
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();

        // Check if user entered something
        if (!searchTerm) {
            resultsContent.innerHTML = '<p class="error-message">Please enter an artist or song name.</p>';
            return;
        }

        // Update the search results title with what user typed
        artistNameSpan.textContent = searchTerm;

        // Show loading message
        showLoading();

        // Fetch data from iTunes API
        searchItunes(searchTerm);

        // Add search term to history
        addToHistory(searchTerm);
        // Clear the search input for next search
searchInput.value = '';
    });

    // ====================================================================
    // CLEAR BUTTON CLICK EVENT
    // ====================================================================
    clearBtn.addEventListener('click', () => {
        // Stop any playing audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }

        // Clear the input field
        searchInput.value = '';
        
        // Reset the artist name display
        artistNameSpan.textContent = ''; // you put {Artist Name} if you like and it will appear
        
        // Clear results and history
        resultsContent.innerHTML = '';
        historyContent.innerHTML = '';

        // Clear search history from localStorage
        clearHistory();
    });

    // ====================================================================
    // ALLOW ENTER KEY TO TRIGGER SEARCH
    // ====================================================================
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    // ====================================================================
    // SHOW LOADING STATE
    // ====================================================================
    function showLoading() {
        resultsContent.innerHTML = '<p class="loading-message">We are fetching your jam!</p>';
        historyContent.innerHTML = '<p class="loading-message">We are fetching your jam!</p>';
    }

    // ====================================================================
    // FETCH DATA FROM ITUNES API
    // ====================================================================
    function searchItunes(term) {
        const itunesURL = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=20`;

        fetch(itunesURL)
            .then(response => response.json())
            .then(data => {
                // Check if we got results
                if (!data.results || data.results.length === 0) {
                    resultsContent.innerHTML = '<p class="error-message">No Search Was Found</p>';
                    historyContent.innerHTML = '';
                    return;
                }

                // Display the results
                displayResults(data.results);

                // Get the first artist name to fetch biography
                const artistName = data.results[0].artistName;
                fetchArtistBio(artistName);
            })
            .catch(error => {
                console.error('Error fetching from iTunes:', error);
                resultsContent.innerHTML = '<p class="error-message">Error fetching music. Please try again later.</p>';
                historyContent.innerHTML = '';
            });
    }

    // ====================================================================
    // DISPLAY SEARCH RESULTS
    // ====================================================================
    function displayResults(results) {
        // Clear previous results
        resultsContent.innerHTML = '';

        // Reset currently playing media
        currentAudio = null;

        // Loop through each result and create HTML
        results.forEach(item => {
            // Create a result card container
            const resultCard = document.createElement('div');
            resultCard.className = 'result-card';

            // Get album artwork (use larger version if available)
            const albumArt = item.artworkUrl100.replace('100x100', '200x200');

            // Get release year from release date
            const releaseYear = item.releaseDate ? new Date(item.releaseDate).getFullYear() : 'N/A';

            // Build the HTML for each result
            resultCard.innerHTML = `
                <div class="result-left">
                    <img src="${albumArt}" alt="${item.trackName} album art" class="album-art">
                    <div class="result-info">
                        <p><strong>Artist:</strong> ${item.artistName}</p>
                        <p><strong>Band Name:</strong> ${item.artistName}</p>
                        <p><strong>Song:</strong> ${item.trackName}</p>
                        <p><strong>Year:</strong> ${releaseYear}</p>
                        <a href="${item.trackViewUrl}" target="_blank" rel="noopener noreferrer" class="buy-btn">
            Buy on iTunes</a>
                    </div>
                    <div class="audio-container">
                        <audio controls class="audio-player" data-audio>
                            <source src="${item.previewUrl}" type="audio/mp4">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                </div>
            `;

            // Add the card to the results section
            resultsContent.appendChild(resultCard);
        });

        // Add event listeners to all audio players
        setupMediaControls();
    }

    // ====================================================================
    // SETUP MEDIA CONTROLS TO STOP OTHER PLAYERS
    // ====================================================================
    function setupMediaControls() {
        // Get all audio players
        const audioPlayers = document.querySelectorAll('[data-audio]');
        
        // Add event listener to each audio player
        audioPlayers.forEach(audio => {
            audio.addEventListener('play', function() {
                // Stop any currently playing audio (except this one)
                if (currentAudio && currentAudio !== this) {
                    currentAudio.pause();
                }
                // Update current audio reference
                currentAudio = this;
            });
        });
    }

    // ====================================================================
    // FETCH ARTIST BIOGRAPHY FROM MUSICBRAINZ API
    // ====================================================================
    function fetchArtistBio(artistName) {
        // Show loading in history section
        historyContent.innerHTML = '<p class="loading-message">We are fetching the artist details.</p>';

        // Step 1: Search for the artist to get their MusicBrainz ID
        const searchURL = `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(artistName)}&fmt=json`;

        fetch(searchURL, {
            headers: {
                'User-Agent': 'JamifyStudio/1.0.0 (school-project)'
            }
        })
            .then(response => response.json())
            .then(data => {
                // Check if we found the artist
                if (!data.artists || data.artists.length === 0) {
                    historyContent.innerHTML = '<p class="info-message">No artist biography found.</p>';
                    return;
                }

                // Get the first artist result (most relevant)
                const artist = data.artists[0];
                const artistId = artist.id;

                // Step 2: Fetch detailed artist info including biography
                fetchArtistDetails(artistId);
            })
            .catch(error => {
                console.error('Error searching MusicBrainz:', error);
                historyContent.innerHTML = '<p class="error-message">Error fetching artist information.</p>';
            });
    }

    // ====================================================================
    // FETCH DETAILED ARTIST INFORMATION
    // ====================================================================
    function fetchArtistDetails(artistId) {
        const detailsURL = `https://musicbrainz.org/ws/2/artist/${artistId}?fmt=json&inc=annotation`;

        fetch(detailsURL, {
            headers: {
                'User-Agent': 'JamifyStudio/1.0.0 (school-project)'
            }
        })
            .then(response => response.json())
            .then(artist => {
                displayArtistBio(artist);
            })
            .catch(error => {
                console.error('Error fetching artist details:', error);
                historyContent.innerHTML = '<p class="error-message">Error fetching artist biography.</p>';
            });
    }

    // ====================================================================
    // DISPLAY ARTIST BIOGRAPHY
    // ====================================================================
    function displayArtistBio(artist) {
        // Clear previous content
        historyContent.innerHTML = '';

        // Check if biography/annotation exists
        if (artist.annotation) {
            // MusicBrainz annotations can contain HTML, so we'll display it
            historyContent.innerHTML = `
                <div class="artist-bio">
                    <h3>${artist.name}</h3>
                    <div class="bio-content">
                        ${artist.annotation}
                    </div>
                </div>
            `;
        } else {
            // If no biography, show basic info
            let bioHTML = `<div class="artist-bio"><h3>${artist.name}</h3>`;
            
            if (artist.type) {
                bioHTML += `<p><strong>Type:</strong> ${artist.type}</p>`;
            }
            
            if (artist.country) {
                bioHTML += `<p><strong>Country:</strong> ${artist.country}</p>`;
            }
            
            if (artist['life-span'] && artist['life-span'].begin) {
                bioHTML += `<p><strong>Founded:</strong> ${artist['life-span'].begin}</p>`;
            }
            
            if (artist.disambiguation) {
                bioHTML += `<p>${artist.disambiguation}</p>`;
            } else {
                bioHTML += `<p>No detailed biography available for this artist.</p>`;
            }
            
            bioHTML += `</div>`;
            historyContent.innerHTML = bioHTML;
        }
    }

    // ====================================================================
    // LOAD SEARCH HISTORY ON PAGE LOAD
    // ====================================================================
    displaySearchHistory();

}); // End of DOMContentLoaded

// ====================================================================
// END OF SCRIPT
// ====================================================================