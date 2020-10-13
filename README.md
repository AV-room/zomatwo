#Zomatwo
A small app written in React and fuelled by Zomato's API to find local places to eat.

## Responsive design

Breakpoints of 620px and 890px have been adopted.

## Potential design issues

- No way for user to reset filters.
- Neither results list nor detailed view on wireframe display any data related to the filters.
- No filter submit button, potentially undesirable for accessibility.
- The ability to sort results by price or rating would be helpful.
- Would also be helpful to display the number of results.

## Technical notes

- Zomato's API rate limit (100) and search API design made it hard to return matches for cost and rating filters. I really wasn't sure how to get around this, and have implemented a solution where 2 separate queries are made to the search API when both cost and ratings filters are supplied. I think I've ended up making more requests than seems reasonable to try to find the biggest set of matches in this circumstance.
- I borrowed sliders from Material UI to save a bit of time. At work in the past, I have generally looked for libraries that I might be able to use in projects instead of reinventing the wheel. I also borrowed Material's checkbox groups too at some stage, but ending up writing my own after a while.
- Looks like there are some issues with debouncing associated with sliders, causing the number of results to take a second to "settle" after interacting with the cost/ratings sliders. In some cases, the results returned don't actually satisfy the filter criteria which I think stems from this issue. I have started looking into how to incorporate debouncing to improve the reliability of the filtering.
- The scrollbar in the results list is missing, which means you have to scroll back up to look at a restaurant's information in detail. I'm sure this is a simple fix and I've tried a few things to no avail.
- When there are no results (e.g. in the pre-filter state), the height of the results panel is too short and it doesn't fill the screen. Again, I'm sure this is a simple fix but it also evades me.
- Image loading is janky.
- Image is stretched through the medium-large breakpoint range.

## Commands

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
