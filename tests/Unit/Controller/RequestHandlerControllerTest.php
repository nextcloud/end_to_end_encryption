<?php
/**
 * @copyright Copyright (c) 2017 Bjoern Schiessle <bjoern@schiessle.org>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


namespace OCA\EndToEndEncryption\Tests\Controller;


use OCA\EndToEndEncryption\Controller\RequestHandlerController;
use OCA\EndToEndEncryption\EncryptionManager;
use OCA\EndToEndEncryption\KeyStorage;
use OCA\EndToEndEncryption\LockManager;
use OCA\EndToEndEncryption\SignatureHandler;
use OCP\AppFramework\Http;
use OCP\IL10N;
use OCP\ILogger;
use OCP\IRequest;
use Test\TestCase;

class RequestHandlerControllerTest extends TestCase {

	/** @var  IRequest|\PHPUnit_Framework_MockObject_MockObject */
	private $request;

	/** @var  KeyStorage|\PHPUnit_Framework_MockObject_MockObject */
	private $keyStorage;

	/** @var  SignatureHandler|\PHPUnit_Framework_MockObject_MockObject */
	private $signatureHandler;

	/** @var  EncryptionManager|\PHPUnit_Framework_MockObject_MockObject */
	private $encryptionManager;

	/** @var  LockManager|\PHPUnit_Framework_MockObject_MockObject */
	private $lockManager;

	/** @var  ILogger|\PHPUnit_Framework_MockObject_MockObject */
	private $logger;

	/** @var IL10N|\PHPUnit_Framework_MockObject_MockObject */
	private $l10n;

	/** @var string valid CSR (CN set to "admin") */
	private $validCSR = "-----BEGIN CERTIFICATE REQUEST-----
MIIC7jCCAdYCAQAwgagxCzAJBgNVBAYTAlVLMREwDwYDVQQIDAhTb21lcnNldDEU
MBIGA1UEBwwLR2xhc3RvbmJ1cnkxHzAdBgNVBAoMFlRoZSBCcmFpbiBSb29tIExp
bWl0ZWQxHzAdBgNVBAsMFlBIUCBEb2N1bWVudGF0aW9uIFRlYW0xDjAMBgNVBAMM
BWFkbWluMR4wHAYJKoZIhvcNAQkBFg93ZXpAZXhhbXBsZS5jb20wggEiMA0GCSqG
SIb3DQEBAQUAA4IBDwAwggEKAoIBAQDHWU8rWlK3lud/r5OQoilxypgIzbBf5pqM
H0rpYwFv3uctnK5Lt3M+WY45XdJt98Pq8eQ0AbyAf3IuhnpF+X2Ej3QnCenZ0H+B
J6/mZXdo9f7IXa2wH5LtA2cmm1XWQWubN/Jzr9psq+kxbocyGTQhNGeeB2OPcgyl
73eddJNIbFVlNEzbdcBNNsSwKcB+LP/JyJ9e1HZ4af6CHdX2SG1HvO+dICdEuO2E
mC9lM896MJFWwNns5mx453Y1FmxFmAi1zQAAP+AZ5Taqy6yCzqJ9Y4/FDRi1NC5V
stnu9REuPYSS8YgsJwQE/DUd+I+UonkcDfac8PIH5p5YHpMq0ChvAgMBAAGgADAN
BgkqhkiG9w0BAQUFAAOCAQEAh8YVAsAcPR5v7kv96UtkVI4xK6R9BdmVsnisxTpm
g9JVbfji7kpxbSgXfRSozTG3bl9ynrck39/2SoFQGSGrW2iV+drclftSk+uBFb1F
iXYEWJxYSz2CcUeijoBrBsarfmODgOHzmgXmCoOToz2DkdtM7g9INWkC06Do4pTQ
fqA3PS2td1gWqQCQthF9IWOCIxNI16lokVTgNCZKewXsn9Bjm3hsLLeJU9jBXyVN
w7829dr37SuA2kQb86aVpqdL50v3HjCclXd7PfWiYqajuHaIsokBV5ly2IdQo4Cz
AYzYQFPtjsDZ4Tju4VZKM4YpF2GwQgT7zhzDBvywGPqvfw==
-----END CERTIFICATE REQUEST-----
";

	/** @var string */
	private $invalidCSR = "-----BEGIN CERTIFICATE REQUEST-----\nMIIC7jCCAdYCAQAwgagxCzAJBgNVBAYTAlVLMREwDwYDVQQIDAhTb21lcnNldDEU\nMBIGA1UEBwwLR2xhc3RvbmJ1cnkxHzAdBgNVBAoMFlRoZSBCcmFpbiBSb29tIExp\nbWl0ZWQxHzAdBgNVBAsMFlBIUCBEb2N1bWVudGF0aW9uIFRlYW0xDjAMBgNVBAMM\nBWFkbWluMR4wHAYJKoZIhvcNAQkBFg93ZXpAZXhhbXBsZS5jb20wggEiMA0GCSqG\nSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDHWU8rWlK3lud%2Fr5OQoilxypgIzbBf5pqM\nH0rpYwFv3uctnK5Lt3M%2BWY45XdJt98Pq8eQ0AbyAf3IuhnpF%2BX2Ej3QnCenZ0H%2BB\nJ6%2FmZXdo9f7IXa2wH5LtA2cmm1XWQWubN%2FJzr9psq%2BkxbocyGTQhNGeeB2OPcgyl\n73eddJNIbFVlNEzbdcBNNsSwKcB%2BLP%2FJyJ9e1HZ4af6CHdX2SG1HvO%2BdICdEuO2E\nmC9lM896MJFWwNns5mx453Y1FmxFmAi1zQAAP%2BAZ5Taqy6yCzqJ9Y4%2FFDRi1NC5V\nstnu9REuPYSS8YgsJwQE%2FDUd%2BI%2BUonkcDfac8PIH5p5YHpMq0ChvAgMBAAGgADAN\nBgkqhkiG9w0BAQUFAAOCAQEAh8YVAsAcPR5v7kv96UtkVI4xK6R9BdmVsnisxTpm\ng9JVbfji7kpxbSgXfRSozTG3bl9ynrck39%2F2SoFQGSGrW2iV%2BdrclftSk%2BuBFb1F\niXYEWJxYSz2CcUeijoBrBsarfmODgOHzmgXmCoOToz2DkdtM7g9INWkC06Do4pTQ\nfqA3PS2td1gWqQCQthF9IWOCIxNI16lokVTgNCZKewXsn9Bjm3hsLLeJU9jBXyVN\nw7829dr37SuA2kQb86aVpqdL50v3HjCclXd7PfWiYqajuHaIsokBV5ly2IdQo4Cz\nAYzYQFPtjsDZ4Tju4VZKM4YpF2GwQgT7zhzDBvywGPqvfw%3D%3D\n-----END+CERTIFICATE+REQUEST-----\n";

	protected function setUp(): void {
		parent::setUp();

		$this->request = $this->createMock(IRequest::class);
		$this->keyStorage = $this->getMockBuilder(KeyStorage::class)
			->disableOriginalConstructor()->getMock();
		$this->signatureHandler = $this->getMockBuilder(SignatureHandler::class)
			->disableOriginalConstructor()->getMock();
		$this->encryptionManager = $this->getMockBuilder(EncryptionManager::class)
			->disableOriginalConstructor()->getMock();
		$this->lockManager = $this->getMockBuilder(LockManager::class)
			->disableOriginalConstructor()->getMock();
		$this->logger = $this->createMock(ILogger::class);
		$this->l10n = $this->createMock(IL10N::class);

	}

	/**
	 * get controller
	 *
	 * @param $uid user who calls the controller
	 * @return RequestHandlerController
	 */
	private function getController($uid) {
		return new RequestHandlerController(
			'e2e',
			$this->request,
			$uid,
			$this->keyStorage,
			$this->signatureHandler,
			$this->encryptionManager,
			$this->lockManager,
			$this->logger,
			$this->l10n
		);
	}

	/**
	 * test public key, valid crs and valid cn
	 */
	public function testCreatePublicKeySuccessful() {
		$controller = $this->getController('admin');
		$result = $controller->createPublicKey($this->validCSR);
		$this->assertSame(Http::STATUS_OK, $result->getStatus());
	}

	/**
	 * test public key, valid crs but invalid cn
	 * @expectedException \OCP\AppFramework\OCS\OCSForbiddenException
	 */
	public function testCreatePublicKeyInvalidCN() {
		$controller = $this->getController('user1');
		$controller->createPublicKey($this->validCSR);
	}

	/**
	 * test public key, invalid crs
	 * @expectedException \OCP\AppFramework\OCS\OCSBadRequestException
	 */
	public function testCreatePublicKeyInvalidCSR() {
		$controller = $this->getController('admin');
		$this->signatureHandler->expects($this->once())->method('sign')
			->with($this->invalidCSR)->willThrowException(new \BadMethodCallException());
		$controller->createPublicKey($this->invalidCSR);
	}


}
