const casper = require('casper').create({
    viewportSize: {
        width: 1920,
        height: 1080
    }
});

/* Start casper and go to the website */
casper.start('https://kolejka-wsc.mazowieckie.pl/rezerwacje/pol/login');

casper.then(function() {
        console.log('Starting casper & opening the site', this.getTitle(), this.getCurrentUrl());
    })

/* Click on localization selector to reveal location dropdown */
casper.then(function() {
    this.click("a[data-activates='location-select']");
    console.log("Clicking on location selector");
})

casper.wait(3000, function() {
    console.log('wait 3 seconds');
});

casper.then(function() {
    this.capture('kolejka_step1.png');
})

/* Click on Warsaw location */
casper.then(function() {
    this.click("#location-select > li:nth-child(1) > a");
    console.log("Clicking on Warsaw button")
})

casper.wait(3000, function() {
    console.log('wait 3 seconds');
});

casper.then(function() {
    this.capture('kolejka_step2.png');
})

/* Wait until the page is loaded and fill in the login form */
casper.waitForSelector('form#LoginForm', function() {
    this.fill('form#LoginForm', {
        'data[User][email]': 'karo.a.kazmierska@gmail.com',
        'data[User][password]': 'portugues'
    }, true);
    console.log('Login completed')
})

/* Wait until the user gets logged in */
casper.waitWhileSelector('form#LoginForm', function(){
    console.log('Redirected to:', this.getTitle(), this.getCurrentUrl());
})

casper.then(function() {
    this.capture('kolejka_step3.png');
})

/* Click on the queueInfo button */
casper.then(function() {
    this.click("a[href='/rezerwacje/info/queueInfo']");
    console.log("Clicking on queue info")
})

/* Wait for the page response */
casper.waitWhileSelector("a[href='/rezerwacje/info/queueInfo']", function(){
    console.log('Redirected to:', this.getTitle(), this.getCurrentUrl());
})

casper.then(function() {
    this.capture('kolejka_step4.png');
})

/* Select correct queue */
casper.then(function() {
    this.click('.row.cards > div:nth-child(7) > .card.small > .card-action > a');

})

/* Wait until the page with rules is loaded and click that you accept the regulations */
casper.wait(3000, function() {
    console.log('wait 3 seconds');
});

casper.then(function() {
    // this.click('#terms'); /* Did not work... */
    this.evaluate(function() {
        document.querySelector('#btn').classList.remove('disabled');
    })
    console.log('Clicked on terms input checkbox')
    console.log(this.getHTML('#customForm'))
})

casper.wait(3000, function() {
    console.log('wait 3 seconds');
});

casper.then(function() {
    this.capture('kolejka_step5.png');
})

casper.then(function() {
    this.click('#btn');
})

casper.wait(3000, function() {
    console.log('wait 3 seconds');
});

casper.then(function() {
    this.capture('kolejka_step6.png');
})


/* Now:
- go to August
- check if selected day has some class
- if no --> check again
- if yes --> break and trigger alarm!

 */

casper.thenOpen('https://kolejka-wsc.mazowieckie.pl/rezerwacje/pol/queues/200064/200084', function() {
    this.echo('Entering the calendar', this.getTitle(), this.getCurrentUrl())
    this.then(function () {
        function checkReload() {
            this.echo('Firing function checkReload');
            this.capture('kolejka_first-calendar.png')
            this.click("div[id*='nav-next']");
            this.echo('Clicked on the next arrow');
            this.capture('kolejka_second-calendar.png')
            this.wait(3000);
            this.waitForSelector("div[id*='2018-08-14']", function() {
                console.log('Waited for desired date to appear');
                // var dateSlot = this.getElementAttribute("div[id*='2018-08-14']", 'class');
                if (this.exists("div[id*='2018-08-14'].day.good")) {
                    this.echo('JEST!!!')
                    return;
                } else {
                    this.echo('Date not available yet, checking again')
                    this.reload();
                    this.wait(5000, checkReload)
                }
            });

        }
        this.then(checkReload);
    })
});

// casper.waitForSelector('#btn', function() {
//     console.log(document.querySelector('#btn').classList.remove('disabled'))
// });
//
// casper.wait(3000, function() {
//     console.log('wait 3 seconds');
// });
//
//
//

//
// casper.wait(3000, function() {
//     console.log('wait 3 seconds');
// });
//


casper.run();
