# Travellab

## Description

This is a website where you can create your travel wishlists and a list of countries you've already been to. The user has access to a lot of details about each countries and can look for some thanks to a search bar.

## User Stories

404 - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault

500 - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault

Homepage - As a user I want to be able to access the homepage and access my profile or search for a country

sign up - As a user I want to sign up so I can create my travel whishlists

firstChoice - As a user after signup I can pre select some countries to create my wishlist

login - As a user I want to be able to log in so I can access my wishlists

logout - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account

userProfile - As a user I want to access my profile and edit it if needed and edit my wishlists

country-search-results - As a user I want to be able to search for a country and access the details of this country

country-details - As a user I want to be able to see the details of the country I looked for

## Backlog

Configurate cookies
more filters
favicon
use of others APIs like TripAdvisor and GoogleMaps
special message for user birthday
Go see another user lists


## ROUTES:

### GET /home or /
renders homepage.hbs

### POST /home or /
signin form renders profile.hbs 

body :

username
password

### GET /signup
renders signup.hbs

### POST /signup
renders firstwish.hbs if signup is successful 

body :

email
username
password
birthday
photo
favorite country
favorite way of traveling
GET /signup/firstwish
renders to firstwish.hbs

### POST /logout
body: (empty)

### GET /home/profile
renders profile.hbs

### POST /home/profile
search form 

body :

whislist 1
wishlist countries already visited
POST /home/profile/:id/edit
edit profile form body :

email
username
password
birthday
photo
favorite country
favorite way of traveling

### GET /home/profile/add-a-destination
renders countries-search-results.hbs renders /country-details.hbs if user click on a result

### POST /home/profile/add-a-destination
search bar

### GET /country-details
renders /country-details.hbs 
redirect to /profile if user clicks on "add to my list button"

## Models

### User model
email
username
password
birthday
photo
favorite country
favorite way of traveling

### Country Model
name
callingCodes

## Backlog routes
Profile :
more filters for countries
birthday message
access to maps

## Links

### Board
https://www.notion.so/Travellab-db2f83caeadf41699be8ca86f369d0c8

### Wireframes
https://whimsical.com/travel-lab-B9oHatHDp1Abq8PsuRCAMz

### Git
https://github.com/jnmelio/Travellab
