# Jamify Studio for Project 1 - Code Academy (Full Stack Developer Course) 2025-2026

## Description

Jamify Studio is an interactive music discovery application that allows users to search for their favorite artists and songs. The app fetches real-time data from the iTunes Search API to display song results with album artwork and audio previews. It also retrieves artist biographies and details from the MusicBrainz API, giving users a richer music exploration experience.

Users can build a personal search history that persists across sessions using localStorage, making it easy to revisit previous searches with a single click.

## Screenshot

[Jamify Studio Screenshot](assets/images/jamify-search-results-project-1.PNG)

## Deployed Application

[Live Demo](https://nittygrittytechy.github.io/my-projects-code-academy/Jamify%20Studio%20Project%201)
[Repo] (https://github.com/nittygrittytechy/my-projects-code-academy/tree/main/Jamify%20Studio%20Project%201)

## Features

- Search for artists or songs and view results with album artwork
- Listen to 30-second audio previews directly in the browser
- View artist biographies, country of origin, and founding year
- Persistent search history (up to 10 searches) saved in localStorage
- Click any history item to instantly re-run that search
- Visual counter showing history usage (with warning at 9/10)
- Clear search functionality to reset results and history
- Fully responsive design for desktop, tablet, and mobile

## Technologies Used

- HTML5 (Semantic Elements)
- CSS3 (Custom Properties/Variables)
- JavaScript (ES6+)
- Bootstrap 5.3.2
- Google Fonts (DM Serif Text, Oswald)
- localStorage API
- [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html)
- [MusicBrainz API](https://musicbrainz.org/doc/MusicBrainz_API/Search)

## Project Requirements Met

| Requirement | Status |
|-------------|--------|
| Uses at least one server-side API | ✅ Uses two APIs (iTunes & MusicBrainz) |
| App is interactive | ✅ Search input, clickable history, audio playback |
| Visually readable and organized layout | ✅ Clean sections with consistent styling |
| Semantic HTML | ✅ Uses header, main, section, aside, footer |
| Custom CSS or CSS framework | ✅ Bootstrap 5 + custom CSS |
| Basic responsiveness | ✅ Mobile-friendly with breakpoints |
| Deployed to GitHub Pages | ✅ |
| README with required elements | ✅ |

## Stretch Goals Achieved

- ✅ **Two APIs**: iTunes Search API for music data, MusicBrainz API for artist biographies
- ✅ **Client-side storage**: localStorage saves search history across sessions
- ✅ **Loading states**: Displays "We are fetching your jam!" while loading
- ✅ **Error messages**: User-friendly messages when no results found or API errors occur
- ✅ **Accessibility**: Includes aria-labels, semantic HTML, and visible focus states

## How It Works

1. Enter an artist or song name in the search box
2. Click "Search" or press Enter
3. View song results with album art, artist info, and release year
4. Play 30-second audio previews using the built-in player
5. Read artist biography in the sidebar
6. Click any search history tag to repeat a previous search
7. Click "Clear Search" to reset everything

## APIs Used

### iTunes Search API
Returns song data including track name, artist name, album artwork, release date, and preview audio URL.

**Endpoint:** `https://itunes.apple.com/search?term={query}&entity=song&limit=20`

### MusicBrainz API
Returns artist information including type, country, life span, and biographical annotations.

**Endpoint:** `https://musicbrainz.org/ws/2/artist/?query={artistName}&fmt=json`

## License

© 2025 Jamify Studio