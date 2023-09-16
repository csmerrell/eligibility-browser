# Frontend Software Development Engineer -- Technical Coding Problem

The  goal of  this coding  exercise is  to give  us insight  into your
ability to  write code that solves  a problem for a  company.  Besides
giving  us  insight into  your  coding  ability  and your  ability  to
organize data visually,  and it will help us evaluate  your ability to
assess  requirements  and  produce  a  design  that  reacts  to  those
requirements.


## Problem Statement

The Glorious Gumball Co. has asked for help with visualizing their
medical claim data for their employees, retirees and dependents.

The intent is to create an "eligibility browser" single-page web
interface to find eligible employees, dependents, and retirees, and
show their employment history alongside the time and amount for each
claim.

These is an API which goes to fetch all the data in one JSON blob.
You can see an example of this data in the `api-data.json` file.

Build a single-page Vue.js application that displays this data in a
similar way to that exemplified in the `eligibility-browser.jpg`
diagram.  Note that you will need to calculate some information in
order to display the data effectively, including:

* current status of each person, one of:
  * empl: current employee
  * empl, termed: former employee, no retirement plan
  * dep: current dependent
  * dep, termed: former dependent
  * ret: current retiree
  * ret, termed: former retiree, termed out of eligibility
* number of valid claims for each person (displayed in title of
    "claims" column)
* total claim amount for each person

You are welcome to use either Vue.js v2 or Vue.js v3.


### Scaling

Describe how you would help scale this process for the following
cases:
* 100 claims per year for a person
* 10,000 employees, and more than 10,000 dependents
