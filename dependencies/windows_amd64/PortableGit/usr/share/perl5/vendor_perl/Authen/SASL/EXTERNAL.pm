# Copyright (c) 2002 Graham Barr <gbarr@pobox.com>. All rights reserved.
# This program is free software; you can redistribute it and/or
# modify it under the same terms as Perl itself.

package Authen::SASL::EXTERNAL;
$Authen::SASL::EXTERNAL::VERSION = '2.1700';
use strict;
use warnings;


sub new {
  shift;
  Authen::SASL->new(@_, mechanism => 'EXTERNAL');
}

1;

