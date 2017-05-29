---
date: '2016-08-31T14:53:17-04:00'
title: 'Track planes with a USB dongle'
description: 'Instructions for getting real-time, local commercial and general aviation data with a RTL-SDR USB dongle and open-source software.'
banner: '747.jpg'
tags: ["tech"]
---

*(N.B. This document also lives at https://gist.github.com/fasiha/c123a9c6b6c78df7597bb45e0fed808f.)*

## Introduction
I’m not very familiar with the aviation jargon (see [FAA’s ADS-B FAQ](https://www.faa.gov/nextgen/programs/adsb/faq/)), but ADS-B is a next-gen system where aircraft are equipped with transponders that periodically broadcast their own positions and receive the reports from both other aircraft (direct air-to-air) as well as air-traffic control (ATC) ground transmitters.

There are two separate ADS-B radio bands: the *commercial aviation* (CA) is at 1090 MHz while the *general aviation* (GA) is at 978 MHz. If I can be permitted a gross generalization—the former corresponds to big commercial jets and the latter to small private aircraft.

Because ADS-B is designed to democratize airspace situational awareness (in contrast to the older setup, like from films, where a central air-traffic controller is coordinating all these aircraft that can’t see each other), we can buy cheap RF receivers to pick up and decode the messages being broadcast by aircraft and ground towers to get our own picture of the local airspace. This rabbit hole actually goes quite deep: FlightAware.com has built a business on crowdsourced ADS-B receivers. They will give you a networked ADS-B kit called [FlightFeeder](https://flightaware.com/adsb/flightfeeder/), for free, if you live in an area of sparse coverage.

Here’s one way to receive, log, and real-time visualize the traffic on either of these ADS-B bands using a USB radio receiver and some open-source software on a Mac.

## Hardware & base software setup
Buy RTL-SDR. [$25 kit on Amazon](https://www.amazon.com/dp/B011HVUEME).

Optional: buy antennas. [$20 Stratux DMURRAY14 kit](https://www.amazon.com/gp/product/B01EJUM83S).

Install [`librtlsdr`](http://brewformulas.org/Librtlsdr).
```nohighlight
$ brew install pkg-config cmake librtlsdr
```

## [dump1090](https://github.com/mutability/dump1090)
### Setup
Clone [@mutability’s fork of dump1090](https://github.com/mutability/dump1090) to collect and visualize *commercial* aviation (CA), which operates in the 1090 MHz band. (You’ll want this even if you’re only after *general* aviation (GA), which is on the 978 MHz band—our dump978 setup will use dump1090 for visualization.)
```nohighlight
$ git clone https://github.com/mutability/dump1090.git
$ cd dump1090
$ make -j4 # omit if you will only do dump978/GA
```

### Start external webserver
If you’ve ever used the original dump1090 by @antirez: @mutability’s fork of dump1090 is architecturally different than the original. This fork writes a JSON file which has to be served by some external webserver.

First create a directory to store the parsed results in JSON:
```nohighlight
$ mkdir public_html/data
```
Then start a webserver that hosts the `public_html` directory. You have many choices but here’s a really simple one:
```nohighlight
$ cd public_html && python -m SimpleHTTPServer 8090
```
This uses Python2 to serve the current directory’s contents: browse to [http://127.0.0.1:8090/gmap.html](http://127.0.0.1:8090/gmap.html) to see an OpenStreetMap.

Now, an application like dump1090 or dump978 can put data inside this directory and the map will display it.

### Run, log, and visualize dump1090
Finally, launch dump1090 and pipe its output to disk for logging:
```nohighlight
$ ./dump1090 --write-json public_html/data >> log.txt
```

You should soon see aircraft showing up on the map:

![dump1090 in action](http://i.imgur.com/IWjBF4r.png)

### dump1090 example output
Here’s some example lines from `log.txt`: this is the standard output of dump1090. (For debugging, looking at the last few lines of `log.txt` with `$ tail -f log.txt` can help.)
```nohighlight
*8dab77ee99459081c0084e933a70;
CRC: 000000
RSSI: -22.7 dBFS
Score: 1400
Time: 26780.42us (phase: 300)
DF 17: ADS-B message.
  Capability     : 5 (Level 2+, airborne)
  ICAO Address   : ab77ee
  Extended Squitter  Type: 19
  Extended Squitter  Sub : 1
  Extended Squitter  Name: Airborne Velocity
    EW status         : Valid
    EW velocity       : -399
    NS status         : Valid
    NS velocity       : -13
    Vertical status   : Valid
    Vertical rate src : 0
    Vertical rate     : 64
    HAE/Baro offset   : 1925 ft

*8da923cf99157717c004477716b8;
CRC: 000000
RSSI: -30.7 dBFS
Score: 1400
Time: 53030.33us (phase: 240)
DF 17: ADS-B message.
  Capability     : 5 (Level 2+, airborne)
  ICAO Address   : a923cf
  Extended Squitter  Type: 19
  Extended Squitter  Sub : 1
  Extended Squitter  Name: Airborne Velocity
    EW status         : Valid
    EW velocity       : -374
    NS status         : Valid
    NS velocity       : 189
    Vertical status   : Valid
    Vertical rate src : 0
    Vertical rate     : 0
    HAE/Baro offset   : 1750 ft
```
Note that the `Time` field above corresponds to microseconds since the application started. This provides a simple way of timestamping each observation, assuming you can tell when the application started.

## [dump978](https://github.com/mutability/dump978)
### Setup
Clone and build @mutability’s dump978 repository to collect general aviation beacons, which operate in the 978 MHz band. Don’t run this when in the same directory as `dump1090`—you almost never want a git repository inside another git repository.
```nohighlight
$ git clone https://github.com/mutability/dump978.git
$ cd dump978
$ make -j4
$ cp -r /PATH/TO/dump1090/public_html .
$ mkdir -p public_html/data
```
The last two lines copy dump1090’s webapp to the dump978 directory and (re)creates a `data/` subdirectory.

### Start external webserver
Following the same process as dump1090, we can start a webserver using plain Python2. We will choose a different port to avoid conflicts with the dump1090 webapp.
```nohighlight
$ cd public_html && python -m SimpleHTTPServer 8978
```
Open a browser tab to [http://127.0.0.1:8978/gmap.html](http://127.0.0.1:8978/gmap.html).

### Run, log, and visualize dump978
dump978 is a little different from dump1090, in that dump978 accepts binary samples output by `rtl_sdr`, rather than doing this behind-the-scenes:
```nohighlight
$ rtl_sdr -f 978000000 -s 2083334 - | ./dump978 | tee --append log.txt | ./uat2json public_html/data
```
Soon, you should start seeing GA traffic in the web browser. dump978’s `uat2json` will update the webapp’s data once a second.

> **Caveat!** The above logs `dump978`’s output to `log.txt`, *but without timestamps,* which might severely limit the use of this data! If you have `ts` (`brew install moreutils` on macOS), I recommend the following:
>
> `$ rtl_sdr -f 978000000 -s 2083334 - | ./dump978 | ts '[%Y-%m-%d.%H.%M.%.S%z]' | tee --append log.txt | cut -d' ' -f2- | ./uat2json public_html/data`
>
> This will prepend a timestamp, followed by a space, like `[2016-11-12.19.31.47.117154-0500]`, before each line. That `tee` writes such timestamped data to a file, but then the `cut` strips the timestamps before sending the original result to `uat2json`. (Caveat the second: that strftime specifier, `[%Y-%m-%d.%H.%M.%.S%z]` could be invalid on some systems, check!)

![dump978 in action](http://i.imgur.com/X7AiJFC.png)

Beware: both browser windows (dump1090’s and dump978’s) will say “dump1090”, since we just copied dump1090’s webapp and are dumping 978 MHz data into it. The only difference is the port number in the URL.

### dump978 example output
Here are some lines from the `log.txt` file produced by dump978:
```nohighlight
-10a3a09839220f88e80218d911a83a202f00000000000000000000000019c0000000;rs=1;
-10a3a0983921cf88e85e18d911a83a001f00000000000000000000000019c0000000;
+3916598895a4aea05a8006744c005011a02cd549833c31e70c1a833c31e6fc31c31832df0c392d4839e79e601855f0d70806157cb0c2044e232e79c0939379c142143347833c72c2fcf1cb1831e30c362d4839e79e6008b3b0d70811388cb9e3424e4de7050850cd1e0cf1cb3bf3c72d20c75c30d8b520e30c3082d4c84818022cec33c203d60f1d70811388cb9e3424e4de705518cf0bf3c71e5a8143b1d6fcf1c7069e7053014d480e3e004d113801194833c70d60385614833c71c7d79d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000;rs=32;
+3916598895a4bfa000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000;rs=32;
-0b28c2ef38db29868efe279641940cc01105c4e6c4e6c40a82700300000000000000;rs=2;
-00a3a0983921b388e88418d911a83a001900;
```
dump978 makes available a `uat2txt` executable, which produces the following when fed in the above:
```nohighlight
$ cat log.txt | ./uat2txt
HDR:
 MDB Type:          2
 Address:           A3A098 (ICAO address via ADS-B)
SV:
 NIC:               9
 Latitude:          +40.1717
 Longitude:         -83.7378
 Altitude:          8900 ft (barometric)
 N/S velocity:      -105 kt
 E/W velocity:      115 kt
 Track:             132
 Speed:             155 kt
 Vertical rate:     -64 ft/min (from geometric altitude)
 UTC coupling:      yes
 TIS-B site ID:     0
AUXSV:
 Sec. altitude:     9275 ft (geometric)

HDR:
 MDB Type:          2
 Address:           A3A098 (ICAO address via ADS-B)
SV:
 NIC:               9
 Latitude:          +40.1710
 Longitude:         -83.7368
 Altitude:          8900 ft (barometric)
 N/S velocity:      -105 kt
 E/W velocity:      115 kt
 Track:             132
 Speed:             155 kt
 Vertical rate:     0 ft/min (from geometric altitude)
 UTC coupling:      yes
 TIS-B site ID:     0
AUXSV:
 Sec. altitude:     9275 ft (geometric)

UPLINK:
 Site Latitude:     +40.1395 (possibly invalid)
 Site Longitude:    -83.9640 (possibly invalid)
 UTC coupled:       yes
 Slot ID:           14
 TIS-B Site ID:     10
INFORMATION FRAME:
 Length:            181 bytes
 Type:              0 (FIS-B APDU)
FIS-B:
 Flags:             
 Product ID:        413 (Generic Textual Data Product APDU Payload Format Type 2) - Text (DLAC)
 Product time:      19:00
 Report type:       TAF
 Report location:   KMUI
 Report time:       301900Z
 Text:
3019/0101 27009KT 9999 FEW050 FEW200 QNH2990INS
     BECMG 3120/3121 18006KT 9999 BKN050 QNH2984INS
     BECMG 3123/3124 15006KT 8000 -SHRA BKN030 OVC150 QNH2984INS
     TX30/3119Z TN15/3110Z
     LAST NO AMDS AFT 3105 NEXT 3111=


UPLINK:
 Site Latitude:     +40.1395 (possibly invalid)
 Site Longitude:    -83.9640 (possibly invalid)
 UTC coupled:       yes
 Slot ID:           31
 TIS-B Site ID:     10

HDR:
 MDB Type:          1
 Address:           28C2EF (TIS-B track file address)
SV:
 NIC:               6
 Latitude:          +39.9769
 Longitude:         -85.3885
 Altitude:          14800 ft (barometric)
 N/S velocity:      400 kt
 E/W velocity:      96 kt
 Track:             13
 Speed:             411 kt
 Vertical rate:     0 ft/min (from barometric altitude)
 UTC coupling:      no
 TIS-B site ID:     1
MS:
 Emitter category:  No information
 Callsign:          unavailable
 Emergency status:  No emergency
 UAT version:       2
 SIL:               2
 Transmit MSO:      32
 NACp:              7
 NACv:              0
 NICbaro:           0
 Capabilities:      
 Active modes:      
 Target track type: true heading
AUXSV:
 Sec. altitude:     unavailable

HDR:
 MDB Type:          0
 Address:           A3A098 (ICAO address via ADS-B)
SV:
 NIC:               9
 Latitude:          +40.1707
 Longitude:         -83.7364
 Altitude:          8900 ft (barometric)
 N/S velocity:      -105 kt
 E/W velocity:      115 kt
 Track:             132
 Speed:             155 kt
 Vertical rate:     0 ft/min (from geometric altitude)
 UTC coupling:      yes
 TIS-B site ID:     0
```

(Banner credit: NASA, Shuttle Carrier Aircraft (modified Boeing 747s), [ED11-0237-16](https://www.nasa.gov/centers/armstrong/multimedia/imagegallery/SCA/archive2.html#lowerAccordion-set1-slide102). Taken on August 2, 2011.)
