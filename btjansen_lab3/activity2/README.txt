README

Activity 2:
NOTE: Sometimes when initially completing a survey there will be a syntax error in the JSON, it does not always occur and I was unable to identify what caused it. 
Reloading the homepage ('/') will fix it for further survey attempts.

To add new question/response sets to survey.txt please use the same syntax as the previous sets. Must have 1 empty line between each set, then the question followed by the responses each on their own line
New sets must be added to the end of the file.
New question/response sets may require clearing out the answers.txt of the previous surveys with fewer responses.

Changing rendering options while on the final question may cause issues, any other question will work correctly.

C1 DESIGN:
The homepage is routed to '/' and only accepts GET method requests. 
Survey questions will route to '/survey' and will only accept POST method requests
The previous button will reroute to '/prev' and will only accept POST method requests, the next button will route back to '/survey'
The match list page is routed to '/match' and will only accept POST method requests
The render options page is routed to '/render' and will only accept GET method requests

