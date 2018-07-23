const casper = require('casper').create();

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

    /* Click on Warsaw location */
    casper.then(function() {
        this.click("#location-select > li:nth-child(1) > a");
        console.log("Clicking on Warsaw button")
    })

    casper.wait(3000, function() {
        console.log('wait 3 seconds');
    });

    /* Check if the location was selected correctly */
    casper.then(function() {
        console.log('Location selected:', this.fetchText("a[data-activates='location-select'] > span > b")); // returns empty, should return "Warsaw"
    })

    /* Get page content (to compare) */
    casper.then(function() {
        this.echo(this.getHTML('body'));
    })


/* Futher steps */

    // /* Wait until the page is loaded and fill in the login form */
    // casper.waitForSelector('form#LoginForm', function() {
    //     this.fill('form#LoginForm', {
    //         'data[User][email]': 'emailcredentials',
    //         'data[User][password]': 'password'
    //     }, true);
    //     console.log('Login completed')
    // })
    //
    // /* Wait until the user gets logged in */
    // casper.waitWhileSelector('form#LoginForm', function(){
    //     console.log('Redirected to:', this.getTitle(), this.getCurrentUrl());
    // })
    //
    // /* Click on the queueInfo button */
    // casper.then(function() {
    //     this.click("a[href='/rezerwacje/info/queueInfo']");
    //     console.log("Clicking on queue info")
    // })
    //
    // /* Wait for the page response */
    // casper.waitWhileSelector("a[href='/rezerwacje/info/queueInfo']", function(){
    //     console.log('Redirected to:', this.getTitle(), this.getCurrentUrl());
    //     console.log('Location selected:', this.fetchText("a[data-activates='location-select'] > span > b")); // no location selected!
    // })
    //
    // /* Check queue page */
    // casper.then(function() {
    //     this.echo(this.getHTML('main > .container'));
    // })

    casper.run();
