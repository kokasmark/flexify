function HTML_TEMPLATE(user,token){
    return (`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #333;
            }
    
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            h1 {
                text-align: center;
                color: #007bff;
            }
    
            p {
                margin-bottom: 20px;
            }
    
            .btn {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
            }
    
            .btn:hover {
                background-color: #0056b3;
                cursor: pointer;
            }
            #success-p{
                display: none;
                color: green;
            }
        </style>
        <script>
            function copyToken() {
              // Get the text field
              var token = "${token}";
                
              console.log("Success");
            document.getElementById("success-p").style.display = "inline";
               // Copy the text inside the text field
              navigator.clipboard.writeText(token);
              
                  
            }
        </script>
    </head>
    <body>
        <div class="container">
            <h1>Password Reset</h1>
            <p>Hello ${user},</p>
            <p>You have requested a password reset. Please click the button below to reset your password:</p>
            <button class="btn" onclick="copyToken()">Copy Token</button>
            <p class="success" id="success-p">Copied to clipboard!</p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Thank you!</p>
        </div>
    </body>
    </html>
    `);
  }
  module.exports = HTML_TEMPLATE;