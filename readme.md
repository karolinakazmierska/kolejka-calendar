Run: phantomjs node_modules/casperjs/bin/casperjs.js check-availability.js <login> <password> <date>

**About**

Web scraping script, written with phantomJS and caperJS, which monitors an online calendar system to detect if new slots have been made available.

**The problem and some background:**

In order to apply for residence permit in Poland, foreigners living in Warsaw need to register for a meeting through an online calendar. The dates are available for one month ahead, and every day slots for one more day get released. The problem is:
- the slots are released on irregular basis
- they usually are all taken within a few minutes

Which makes it almost impossible to register without sitting in front of the computer for hours and refreshing the page (which, by the way, crashed very often).

**Solution:**

The script logs into the online calendar system using credentials provided via cli, and goes through all the flow: selecting the right queue, accepting T&C, opening the calendar page and checking if any date is available. If no new date is available, the process is repeated. The script is 'waiting' until available slots are detected, and alarms the user by playing sound.
