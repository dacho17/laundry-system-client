TODOs
FE:
    +1. Mobile version of Admin page - nothing has been tested so far
    +2. Standardize the userRole comparisson (lost plenty of time today on enum comparissons and inconsistency)
    +3. Admin header and side drawer. Show the header and side drawer content immediately after login.
    +4. Protect the pages from unauthorized access
        - TENANT: Login -> Availability (home page)
        - RES_ADMIN: Login -> ResAdmin Page (home page)
        - if unauthorized access, bring the user to its home page or login, depending on authentication
    +5. Dynamic rendering is to be implemented in several places in the app
        - Booking done! Availability done!
        - Payment popup for one
    +6. Implement dummy payments
    +7. Re-check how bookings and payments are related.
        - make sure that: If the user has a time slot and and additional right after it, he is able to use the machine!
        - compare what is in the database connected to my test user and what is being shown in the client
        => purchase is connected to the first booking slot
        => Account tab looks good.
        => My booking tab looks good.
        => Activity tab looks good. NOTE/TODO: Retest this as it reflects the logic of the system!
    [DOING!]8. Deploy (dockerize)
    [DOING!]9. Polish the app and make it presentable
        - After the above, recheck the behavior of the application
        - After determined fit, see how it can be deployed (& dockerized maybe)
        - error handling and display
    10. mobile number support

BE:
    0. Error handling
    1. Authorization and Authentication endpoint protection!
    2. set up openAPI/swagger

Improvements:
    - ActivityHistory - sort by createdDate, and then by timeslot chosen
    - on refresh lags
    - create an additional table to which employees will be connected with residences 'employment' table
    - forgot Password functionality
    - Splitting admin page into 3? With each having 2 tabs
    - stripe integration...

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
