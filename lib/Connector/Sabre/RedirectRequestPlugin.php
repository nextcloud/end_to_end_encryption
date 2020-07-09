<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2020 Georg Ehrke <georg-nextcloud@ehrke.email>
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
namespace OCA\EndToEndEncryption\Connector\Sabre;

use OCA\DAV\Connector\Sabre\Directory;
use OCA\DAV\Connector\Sabre\File;
use Sabre\DAV\Exception\Forbidden;
use Sabre\DAV\Exception\NotFound;
use Sabre\DAV\INode;
use Sabre\DAV\PropFind;
use Sabre\DAV\Server;
use Sabre\HTTP\RequestInterface;
use Sabre\HTTP\ResponseInterface;

/**
 * Class WritePlugin
 *
 * This plugin intercepts requests to end-to-end-encrypted folders
 * and redirects request to a different path.
 *
 * If a file or folder is created or updated, the new version will be written to
 * to $uri.e2e-to-save. On unlock, $uri.e2e-to-save will be moved to $uri.
 *
 * If a file or folder is deleted, the existing version will be moved
 * from $uri to $uri.e2e-to-delete. On unlock, $uri will be deleted.
 *
 * If a file or folder is copied or moved, the destination will be $uri.e2e-to-save.
 * On unlock, $uri.e2e-to-save will be moved to $uri.
 *
 * If a client sends a GET or HEAD request, it will check if the file exists.
 * If it does not, it will check if $uri.e2e-to-delete exists and returns that.
 *
 * If a client sends a PROPFIND request, it removes all *.e2e-to-save files
 * from the response and renames $uri.e2e-to-delete to $uri.
 *
 * @package OCA\EndToEndEncryption\Connector\Sabre
 */
class RedirectRequestPlugin extends APlugin {

	/** @var string */
	public const SAVE_SUFFIX = '.e2e-to-save';

	/** @var string */
	public const DELETE_SUFFIX = '.e2e-to-delete';

	/**
	 * {@inheritdoc}
	 */
	public function initialize(Server $server) {
		parent::initialize($server);

		$this->server->on('method:MKCOL', [$this, 'httpMkColPut'], 95);
		$this->server->on('method:PUT', [$this, 'httpMkColPut'], 95);

		$this->server->on('method:COPY', [$this, 'httpCopyMove'], 95);
		$this->server->on('method:MOVE', [$this, 'httpCopyMove'], 95);

		$this->server->on('method:DELETE', [$this, 'httpDelete'], 95);

		$this->server->on('method:GET', [$this, 'httpGetHead'], 95);
		$this->server->on('method:HEAD', [$this, 'httpGetHead'], 95);

		$this->server->on('propFind', [$this, 'propFind'], 5);
	}

	/**
	 * @param RequestInterface $request
	 */
	public function httpCopyMove(RequestInterface $request): void {
		$node = $this->getNode($request->getPath(), $request->getMethod());
		if (!$this->isFile($request->getPath(), $node)) {
			return;
		}
		/** @var File|Directory $node */
		if (!$this->isE2EEnabledPath($node->getPath())) {
			return;
		}

		if ($request->hasHeader('Destination') && $request->getHeader('X-Nc-Sabre-Original-Method') !== 'DELETE') {
			$request->setHeader('Destination', $request->getHeader('Destination') . self::SAVE_SUFFIX);
		}
	}

	/**
	 * @param RequestInterface $request
	 * @param ResponseInterface $response
	 * @return bool
	 */
	public function httpDelete(RequestInterface $request, ResponseInterface $response): bool {
		$node = $this->getNode($request->getPath(), $request->getMethod());
		if (!$this->isFile($request->getPath(), $node)) {
			return true;
		}
		/** @var File|Directory $node */
		if (!$this->isE2EEnabledPath($node->getPath())) {
			// If this is no e2e-enabled path, return true to continue up in the event chain
			return true;
		}

		$url = $request->getUrl();
		$parts = parse_url($url);
		$path = $parts['path'];
		$path .= self::DELETE_SUFFIX;

		$subRequest = clone $request;
		$subRequest->setMethod('MOVE');
		$subRequest->setHeader('X-Nc-Sabre-Original-Method', 'DELETE');
		$subRequest->setHeader('Destination', $path);

		$this->server->invokeMethod($subRequest, $response);

		// Do not return response code for CREATED
		if ($response->getStatus() === 201) {
			$response->setStatus(204);
		}

		// Return false to break the event chain
		return false;
	}

	/**
	 * @param RequestInterface $request
	 * @return bool
	 */
	public function httpMkColPut(RequestInterface $request): void {
		$node = $this->getNode($request->getPath(), $request->getMethod());
		if (!$this->isFile($request->getPath(), $node)) {
			return;
		}
		/** @var File|Directory $node */
		if (!$this->isE2EEnabledPath($node->getPath())) {
			return;
		}

		$url = $request->getUrl();
		$url = $this->addFilenameSuffixToUrl($url, self::SAVE_SUFFIX);
		$request->setUrl($url);
	}

	/**
	 * @param RequestInterface $request
	 */
	public function httpGetHead(RequestInterface $request): void {
		try {
			// Try fetching the node. If it exists, we do nothing
			$this->getNode($request->getPath(), $request->getMethod());
			return;
		} catch (NotFound $ex) {
			// In case the node does not exist, we try to fetch $uri.e2e-to-delete
			$url = $request->getUrl();
			$url = $this->addFilenameSuffixToUrl($url, self::DELETE_SUFFIX);
			$request->setUrl($url);
		}
	}

	/**
	 * @param PropFind $propFind
	 * @param INode $node
	 * @throws NotFound
	 * @throws \Sabre\DAV\Exception\Conflict
	 */
	public function propFind(PropFind $propFind, INode $node): bool {
		if (!$this->isFile($propFind->getPath(), $node)) {
			return true;
		}

		/** @var File|Directory $node */
		if (!$this->isE2EEnabledPath($node->getPath())) {
			return true;
		}

		if (substr($propFind->getPath(), strlen(self::SAVE_SUFFIX) * -1) === self::SAVE_SUFFIX) {
			return false;
		}
		if (substr($propFind->getPath(), strlen(self::DELETE_SUFFIX) * -1) === self::DELETE_SUFFIX) {
			$propFind->setPath(substr($propFind->getPath(), 0, strlen($propFind->getPath()) - strlen(self::DELETE_SUFFIX)));
			return false;
		}

		return true;
	}

	/**
	 * @param string $url
	 * @param string $suffix
	 * @return string
	 */
	protected function addFilenameSuffixToUrl(string $url, string $suffix): string {
		$parts = parse_url($url);

		if (substr($parts['path'], strlen($suffix) * -1) === $suffix) {
			throw new Forbidden('Not allowed to create file with reserved suffix!');
		}

		$hasTrailingSlash = false;
		if (substr($parts['path'], -1) === '/') {
			$parts['path'] = substr($parts['path'], 0, -1);
		}
		$parts['path'] .= $suffix;

		if ($hasTrailingSlash) {
			$parts['path'] .= '/';
		}

		return $this->buildUrlFromParts($parts);
	}

	/**
	 * @param array $parts
	 * @return string
	 */
	protected function buildUrlFromParts(array $parts): string {
		// https://www.php.net/manual/en/function.parse-url.php#106731
		$scheme   = isset($parts['scheme']) ? $parts['scheme'] . '://' : '';
		$host     = $parts['host'] ?? '';
		$port     = isset($parts['port']) ? ':' . $parts['port'] : '';
		$user     = $parts['user'] ?? '';
		$pass     = isset($parts['pass']) ? ':' . $parts['pass']  : '';
		$pass     = ($user || $pass) ? "$pass@" : '';
		$path     = $parts['path'] ?? '';
		$query    = isset($parts['query']) ? '?' . $parts['query'] : '';
		$fragment = isset($parts['fragment']) ? '#' . $parts['fragment'] : '';

		return "$scheme$user$pass$host$port$path$query$fragment";
	}
}
