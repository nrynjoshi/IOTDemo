#  Data Visualization For Home Care
<p float="left">
<span>
Welcome to our cutting-edge application designed for comprehensive health monitoring through advanced data visualization. Our platform integrates seamlessly with various sensors via third-party applications to gather vital health metrics such as heart rate, blood pressure, sugar levels, respiratory data, and more.

All collected data is securely stored on the Azure cloud platform, ensuring reliability and accessibility. Our application retrieves this data from the cloud and employs sophisticated algorithms to generate insightful visualizations. These visual representations provide users with valuable insights into their health status, empowering them to make informed decisions about their well-being.

Furthermore, leveraging state-of-the-art machine learning algorithms, our application offers predictive analysis based on individual health parameters. By analyzing historical data and trends, our algorithm provides personalized predictions, enabling users to proactively manage their health.

Experience the future of healthcare with our innovative solution, where data-driven insights and advanced technology converge to enhance wellness and quality of life.
</span>
</p>

# Language Used
1. Python - used as backend to process data
2. ReactJS - used to visualize representation of data using d3.js

# Run Instruction in Local System
1. To run python application, please using IDE and run button.
2. To install all dependencies of frontend using below command
```
    npm i
```
3. To run the frontend application, please open your terminal and open application_dir/frontend folder and type below command
```
    npm start
```
#  Accessing Reactjs using python (Build process for deployment )
1. Run the build.bat file - this will build the reactjs and copy the final build copies to static folder to serve from python (for more information, you can see the postbuild.js file under frontend folder)
2. Run the python application
3. if deploying this application on server than deploy using python project
4. Enjoy the application using web browsers
