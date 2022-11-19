This project uses TypeScript for its source code. To compile it to JavaScript use ```npm run build```.

For database this project uses MySQL with remote server. Since this is test assignment, ```.env``` file with data necessary
to connect to the database is added to the repository. <br/><br/>
To fill database with sample data, use ```npm run seed```. This will fetch randomly generated names from [<b>randomuser.me</b>](randomuser.me) and 
set subscription data for the users.
<br/><br/>
By default, server will run on <b>localhost:5000</b>, which can also be overridden by setting ```PORT``` and ```HOST``` variables in ```.env``` file.
To start the server, use ```npm run start```.