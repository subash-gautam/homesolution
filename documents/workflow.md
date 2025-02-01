### [<- back](../README.md) <br>

# User
### signup: [name, phone, password], location (lat, lon), profile
### sign-in:  phone, password

## browse:
### category, popular servvices
Serivce has: its details, available providers previding the service, rate, rating etc....
### Booking
for immidate booking, notification goes to all nearby online provider providing service
for scheduled booking, user can select provider based on their history and rating. For this user can inquire provider with chat or phone
After booking confirm:
get provider's acvtivity details (on the way, pending, reached, ...)
get the work done, 
give payment
review the service provider


# Provider
## Register: [name, phone, password], email, address, city, location(lat,lon), document, profile, bio[details], verification status, rating?
## selects services [provided by admin] that they can provide
## Booking
when nearby user book their service, get notified and respond accept/reject
if user book for a scheduled service accept/reject
get location, contact details of requesting user.
can phone, m,essage requesting user.

### after confirm booking 
Share status of thier location
reach location, 
does the job
get payment (cash/online)
get review

# Admin
- verifies provider so that they can serve the clients
- can ban user/provider
- create services/categories that are to be provided
- get statistics about user/provider activities {
    total users
    total providers
    total booking
    recent bookings
    revenue of each provider
    list of pending verificaton of providers
}