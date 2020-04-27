<?php

declare(strict_types=1);
if (!defined('PHPUNIT_RUN')) {
	define('PHPUNIT_RUN', 1);
}
require_once __DIR__ . '/../../../lib/base.php';
if (!class_exists('\PHPUnit\Framework\TestCase')) {
	require_once('PHPUnit/Autoload.php');
}
OC_App::loadApp('end_to_end_encryption');
OC_Hook::clear();
