# Mobideo

Mobideo is a small web application to record videos directly on a mobile device and upload
them to the server.

## Running

Mobideo is built with Sinatra and requires at least Ruby 2.2.

Run

    ruby app.rb

Then, goto http://localhost:4567 in your browser.

## Forward Port 80 to 4567

    sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to 4567
    sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 4567

## Copyright

Mobideo is released under the terms of the MIT License.
Copyright 2017 by Pascal Zumkehr.
See LICENSE for further information.
