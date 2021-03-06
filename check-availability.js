const casper = require('casper').create({
    viewportSize: {
        width: 1920,
        height: 1080
    }
});

var system = require('system');
var args = system.args;
var email = args[4];
var password = args[5];
var date = args[6];

/* Start casper and go to the website */
casper.start('https://kolejka-wsc.mazowieckie.pl/rezerwacje/pol/login');

casper.then(function() {
    this.wait(1000, myCasper)
})

function myCasper() {
    casper.thenOpen('https://kolejka-wsc.mazowieckie.pl/rezerwacje/pol/login');

    casper.then(function() {
            console.log('Starting casper & opening the site', this.getTitle(), this.getCurrentUrl());
        })

    /* Click on localization selector to reveal location dropdown */
    casper.waitForSelector("a[data-activates='location-select']", function() {
        this.click("a[data-activates='location-select']");
        console.log("Clicking on location selector");
        this.wait(3000);
    }, function timeout() {
        this.echo("Waiting for selector has failed. Executing callback");
        myCasper();
    }, 100000)

    /* Click on Warsaw location */
    casper.then(function() {
        this.click("#location-select > li:nth-child(1) > a");
        console.log("Clicking on Warsaw button");
        this.wait(3000);
    })

    /* Wait until the page is loaded and fill in the login form */
    casper.waitForSelector('form#LoginForm', function() {
        this.fill('form#LoginForm', {
            'data[User][email]': email,
            'data[User][password]': password
        }, true);
        console.log('Login completed')
    })

    /* Wait until the user gets logged in */
    casper.waitWhileSelector('form#LoginForm', function() {
        console.log('Redirected to:', this.getTitle(), this.getCurrentUrl());
    }, function timeout() {
        this.echo("Waiting for selector has failed. Executing callback");
        myCasper();
    }, 100000)

    /* Click on the queueInfo button */
    casper.waitForSelector("a[href='/rezerwacje/info/queueInfo']", function() {
        this.click("a[href='/rezerwacje/info/queueInfo']");
        console.log("Clicking on queue info")
    }, function timeout() {
        this.echo("Waiting for selector has failed. Executing callback");
        myCasper();
    }, 100000)

    /* Wait for the page response */
    casper.waitWhileSelector("a[href='/rezerwacje/info/queueInfo']", function(){
        console.log('Redirected to:', this.getTitle(), this.getCurrentUrl());
    })

    /* Select correct queue */
    casper.waitForSelector('.row.cards > div:nth-child(7) > .card.small > .card-action > a', function() {
        this.click('.row.cards > div:nth-child(7) > .card.small > .card-action > a');
        this.wait(3000);
    }, function timeout() {
        this.echo("Waiting for selector has failed. Executing callback");
        myCasper();
    }, 100000)

    /* Click that you accept the regulations */
    casper.waitForSelector('#btn', function() {
        this.evaluate(function() {
            document.querySelector('#btn').classList.remove('disabled');
        })
        console.log('Clicked on terms input checkbox');
        this.wait(3000);
    }, function timeout() {
        this.echo("Waiting for selector has failed. Executing callback");
        myCasper();
    }, 100000)

    casper.then(function() {
        this.click('#btn');
        this.wait(3000);
    })

    /* Open calendar and check for available date */
    casper.thenOpen('https://kolejka-wsc.mazowieckie.pl/rezerwacje/pol/queues/200064/200084', function() {
        this.echo('Entering the calendar', this.getTitle(), this.getCurrentUrl())
        this.then(function () {
            function checkReload() {
                this.echo('Checking...');

                // If the site loaded correctly (no server error)
                if (this.exists("div[id*='nav-next']")) {
                    this.click("div[id*='nav-next']");
                    this.wait(3000);

                    this.waitForSelector(`div[id*='${date}']`, function() {
                        if (this.exists(`div[id*='${date}'].day.good`)) {
                            this.echo('New slots available');
                            this.repeat(40, playSound);
                            return;
                        } else {
                            this.echo('Date not available yet, checking again')
                            this.reload();
                            this.wait(50000, checkReload)
                        }
                    });

                // If no selector (e.g. server error) - reload the page and start again
                } else {
                    this.wait(30000);
                    this.reload();
                    this.wait(10000, checkReload)
                }

            }
            this.then(checkReload);
        })
    });

}

function playSound() {
    var childProcess;
    try {
        childProcess = require("child_process")
    } catch(e) {
        console.log(e, "(error)")
    }
    if (childProcess){
        childProcess.execFile("/bin/bash", ["./pl.sh"], null, function(err, stdout, stderr){
            console.log("execFileSTDOUT: "+stdout);
            console.log("execFileSTDERR:",stderr);
        });
        console.log("Shell commands executed")
    } else {
        console.log("Unable to require child process (error)")
    }
    this.wait(500)// need to wait to play the sound
}

casper.run();
