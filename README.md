# FEASTON!

Project number seven of Udacity's Front-End Developer Nanodegree: an interactive map utliizing asynchronous API calls and Knockout.js as an organizational library.

## About the Project

Udacity provided us with a rubric/spec-sheet, but I decided to put my own spin on it to try and make the app more useful. Instead of hardcoded locations, I utilized the Foursquare Explore API to populate my model and then use that data for my functionality.

## Getting Started

### Build Tools

**Grunt** was the build tool used for this project. Checkout <a href="https://discussions.udacity.com/t/grunt-and-setting-up-a-grunt-workflow-intermediate/21984">Grunt and Setting up a Grunt Workflow</a> for more info and to get started with Grunt.

#### Dependencies

Checkout out the `package.json` file to view the developer dependencies used in this project.

### Getting Up and Running as a User

1. Visit <a href="http://zachnagatani.github.io/fend-map/">http://zachnagatani.github.io/fend-map/</a>
2. Enter in your location (an address or a city), and hit enter,
3. The map will populate with the top 50 rated restaurants near your address,
4. Use the input box to filter the locations by name or food type,
5. Click a location in the list or select a marker on the map to see pertinent info about the location and to get directions to the restaurant!

### Getting Up and Running as a Developer

Clone the repository onto your local machine: `git clone https://github.com/zachnagatani/fend-map.git`

There is a 'src' and a 'dist' directory.

1. Run grunt to build out the `dist` directory from `src`.
2. Copy `index.html` from `src` into `dist`
3. Inline `style.css` from `dist` into your new `index.html`
4. Remove the `../` from the background properties in your inlined CSS (a search and replace will be useful here... there are only two instances).
5. Open your index.html from your dist file locally... and you should be good to go!
6. P.S.: To push to gh-pages, I simply ran `git checkout gh-pages`, `git merge master`, and then copied and pasted the contents of my `dist` folder into the main directory of `gh-pages`.

