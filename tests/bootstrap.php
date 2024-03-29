<?php

declare(strict_types=1);
define('PHPUNIT_RUN', 1);

require_once __DIR__.'/../../../lib/base.php';

\OC::$composerAutoloader->addPsr4('Test\\', OC::$SERVERROOT . '/tests/lib/', true);
\OC::$composerAutoloader->addPsr4('Tests\\', OC::$SERVERROOT . '/tests/', true);

OC_App::loadApp('end_to_end_encryption');

OC_Hook::clear();
