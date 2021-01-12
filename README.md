#  ![](favicon.png) cbevins/fire-containment

A fire containment algorithm and initial attack model based upon the 1995 paper by Jeremy S. Fried and Burton D. Fried titled      *Simulating wildfire containment with realistic tactics.*

It is heavily adapted from the FCAT *Fire Containment Algorithm Test* Pascal program by Jeremy S. Fried (1991).

The primary model assumptions are that the fire is growing under uniform fuel, terrain, and weather conditions, resulting in a steadily growing elliptical fire (except where contained).

Containment "tactics" may be either head or rear attack.  Containment resources are evenly divided and applied to each flank of the fire.

All times (elapsed, resource arrival, containment time, etc)
are from when the fire was *first reported*.
