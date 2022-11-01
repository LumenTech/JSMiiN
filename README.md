# jsmiin
#### the JavaScript Multiprotocol Interlacing Interface Nameserver

               \|/     |  /--\  |\ /|        |\  |
              --O--    |  |     | | |  o  o  | | |
        \|/    /|\     |  |     | | |        | | |
       --O--  /        |  \--\  | | |  |  |  | | |
        /|\  /         |     |  | | |  |  |  | | |
           \/          |     |  |   |  |  |  | | |
           /\       ---/  ---/  |   |  |  |  |  \|

JSMiiN is a DNS Nameserver written in JavaScript (node.js) which
allows it to be easily extended to support experimental DNS RR's
and protocol extensions.

It is intended to support all published DNS and DNSSEC RFC's

The initial release will support only the following types from
RFC's 1034 and 1035:

A                1 a host address
NS               2 an authoritative name server
CNAME            5 the canonical name for an alias
SOA              6 marks the start of a zone of authority
WKS             11 a well known service description
PTR             12 a domain name pointer
HINFO           13 host information
MINFO           14 mailbox or mail list information
MX              15 mail exchange
TXT             16 text strings

AXFR            252 A request for a transfer of an entire zone
\*               255 A request for all records


> SEE LICENSE-MIT CONTRIBUTION-NOTICE AND CREDITS FOR LEGAL DETAILS