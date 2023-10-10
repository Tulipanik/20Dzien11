## Weather app

---

### Introduction

Here's the simple app that uses Accuweather API to show weather forecast for chosen town.

App also contains error messages for wrong input and too much API usages per day.

Project is done for Web and desktop application development classes.

### Code introduction

1. Main <br>
   Main file contains method that start electron app.

2. index <br>
   Index file contains template of application

3. styles/css <br>
   This file contains styling of the project

4. weather_icons <br>
   This folder contains all pictures for weather cast

5. javascript/renderer <br>
   Renderer contains basic API URL and basic API variables. File also supports the form and error messages. There's also most important API request- getLocatio and getAPIRequest method, which fetch from chosen endpoint.
   There's also method that creates path to weather icons

6. javascript/current_weather <br>
   This file constains all methods connected to current weather.

7. javascript/forecasts <br>
   Fiole contains all methods related to the forecast. There's also table creating method

8. javascript/api_key <br>
   api_key is file that doesn't exist in repository. If you want to use this app, you should make your own, which exports APIKey variable. You can take your own key by registering on Accuweather API site.
