# coinHiveMiner
This is a small UI for the https://coin-hive.com/ mining API.


# Demo
A working example of the development branch can be found here:
www.sbhmn.de/miner/index.html 
Feel free to mine some hashes! ;)

# Getting Started
These instructions will get you a copy of the project up and running on your local machine or server.

# Prerequisites
* php  
Tested on php7 but should work on almost all verions >= php5
* mysql  
no specific version needed

# Installation
Download or clone this repository and copy its contents over to your web folder
i.e. `/var/www/`

## Configuration
Open `api/config.php`.
```
<?php
$dbUser = "<DB USER>";
$dbPass = "<DB PASS>";
$dbName = "<DB Name>";
$coinHiveSecret="<Secret>";
```
Replace the placeholders with your database credentials.  
The next step is to fill in your '$coinHiveSecret'.  
To find it log in to your coinhive account and click `Setting` on the top right corner then click `Sites & API Keys` and copy your `Secret Key (private)` and replace '<Secret>' with it.

The last step is to configure your sitekey.  
Open `scripts/miner.js` and replace the key in this line
```
var siteKey = "IQHaechLpoNlho4NmXatRn4iPyQEhDmP"; //Change to your address
```
with your `Site Key (public)`.

# Latest Release
![Screenshot latest release](https://user-images.githubusercontent.com/9130981/30785631-20366b26-a16a-11e7-8efb-dc7f403b1050.png)

# Donations
If you liked it und you want to buy me a beer, you can do so by sending monero to the walllet address below.  
All monero recieved on this wallet will be transformed into beer. 

**Monero wallet**:  
49CVxsyj7RThAQhWCPFs18SRo4cDtWpdLTMKfT3DWxWdWqmKYvSa33tZWCgrqYVkq7BTmwQ1nFnriVLQsD7UEQoU7fFLcaw  

Or get over at https://sbhmn.de/miner/ and donate a bit of your sweet CPU power.
