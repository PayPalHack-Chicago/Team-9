var http = require('http');

http.createServer( function(req, res) {
    if (req.method == 'POST') {
		var msg = '';
        req.on('data', function (data) {
            msg += data;
            console.log(msg);
        });
        req.on('end', function () {
            var commands = msg.split("&");
            if (commands.includes('button=Emails')){
                var index, value, result, numPeople=0, totalCost, paypalLink;
                for (index = 0; index < commands.length; ++index){
                    value = commands[index];
                    if (value.substring(0,5) === "email"){
                        result = value.substring(6);
                        if (result.includes("%2C+")){
                            result = result.split("%2C+")}
                        else if (result.includes("%2C")){
                        result = result.split("%2C")}
                        else{
                        var result = [result];
                        }
                        var num;
                        for (num = 0; num < result.length; ++num){
                            result[num] = result[num].replace("%40", "@");
                            numPeople++;
                        }
                        console.log(result);
                    }
                    if(value.includes("cost")){
                        totalCost = value.substring(5);
                        var totalCost2 = parseFloat(totalCost);
                        console.log(totalCost2);
                    }
                    if(value.includes("paypal")){
                        paypalLink = value.substring(7)
                    }
                }
                
                console.log(numPeople);
                var howMuchToPay = totalCost2/numPeople;
                var message = ("This is a Split It Notification. Please send $" + howMuchToPay + " to the Paypal Me link here: https://www.paypal.me/" + paypalLink);
                email(result, "Split It Notification", message);
                res.writeHead(400, {'Content-Type': 'text/html'});
                res.end('An email has been sent to ' + result);
            } 
        });
    } 
}).listen(8080);

function email (reciever, subjectText, message){
    const sgMail = require('@sendgrid/mail');
    var SENDGRID_API_KEY = PUT_API_KEY_HERE;
    sgMail.setApiKey(SENDGRID_API_KEY);
    var ourEmail = 'split-it@splitit.com';
    const msg = {
      to: reciever,
      from: ourEmail,
      subject: subjectText,
      text: message,
      html: message,
    };
    sgMail.send(msg);
}

