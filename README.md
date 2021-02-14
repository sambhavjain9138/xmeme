#Sambhav Xmeme
The app is a full-stack website based on MERN Tech stack. To deploy this code, you require npm installed at your local and mongoDB if you want to save your data in a local database.

##Installation Steps
###Backend
The Backend is built using NodeJS with express framework. For the database, the code gets connected to MongoDB database. For Deployment Environment, the code gets connected to a local database while for Production Environment, the code gets connected to MongoDB-Atlas which is a cloud database. Let us first start with installation steps:

1) **Install Node Modules**- The node modules are libraries which are installed to provide extended functionalities to our code. To install these modules run,
```
npm install
```
These installs the modules present in the package.json which are required for the code execution

2) Make a new file, config.js to hold the credentials for us to connect with the cloud database. In this file, add the following code
```const CONSTANTS = {};

    CONSTANTS.id="<your id>";
    CONSTANTS.password="<your password>";


    for(key in CONSTANTS)
        if(CONSTANTS.hasOwnProperty(key))
            module.exports[key] = CONSTANTS[key];
```

3) Now we are ready with the code. To run the code in production/deployment environment, run
```
export NODE_ENV=<environment>
``` 

4) Now to start the server, run the following command
```
npm start
```

You can now access your backend server at localhost:8081

###Frontend
The frontend is build on react, which is a javascript library. To start with the server, first move to the frontend folder.

1) **Install Node Modules**- The node modules are libraries which are installed to provide extended functionalities to our code. To install these modules run,
```
npm install
```
These installs the modules present in the package.json which are required for the code execution

2) Open the memePage.js file present in */frontend/src/components/*. On the 5th lin of the file, edit the baseURL and add the path to your backend server. 

3) We are now done with all the necessary installation, and to start the server, run
```
npm start
```
You can now access your web app at localhost:3000

##Demo App
This application is already deployed at [Backend](https://sambhav-xmeme.herokuapp.com/) and [Frontend](https://sambhav-xmeme.netlify.app/)
