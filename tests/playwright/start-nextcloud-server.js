/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import { configureNextcloud, runOcc, startNextcloud, stopNextcloud, waitOnNextcloud } from '@nextcloud/e2e-test-server/docker'
import { readFileSync } from 'fs'
import { execSync } from 'node:child_process'

async function start() {
	const appinfo = readFileSync('appinfo/info.xml').toString()
	const maxVersion = appinfo.match(/<nextcloud min-version="\d+" max-version="(\d\d+)" \/>/)?.[1]

	let branch = 'master'
	if (maxVersion) {
		const refs = execSync('git ls-remote --refs').toString('utf-8')
		branch = refs.includes(`refs/heads/stable${maxVersion}`) ? `stable${maxVersion}` : branch
	}

	return await startNextcloud(branch, true, {
		exposePort: 8089,
	})
}

async function stop() {
	process.stderr.write('Stopping Nextcloud server…\n')
	await stopNextcloud()
	process.exit(0)
}

process.on('SIGTERM', stop)
process.on('SIGINT', stop)

// Start the Nextcloud docker container
const ip = await start()
await waitOnNextcloud(ip)

// Setting up encryption fetches the server public key, which is rate limited to
// 6 anonymous requests per 10 minutes *per IP address* (see the AnonRateLimit on
// KeyController::getPublicServerKey). Every test hits the server from the same
// address, so the whole run shares that budget: across browser projects, shards
// and retries it is exhausted long before the suite ends, and every setup after
// that fails with HTTP 429 until the window rolls over. The limit protects real
// deployments from abuse and has nothing to test here, so it is switched off for
// this throwaway instance. `--type=boolean` matters: a "false" *string* is
// truthy in PHP and would leave the limit enabled.
//
// This has to happen before `configureNextcloud`, because that is what prints
// the line Playwright waits for before it starts the tests.
await runOcc(['config:system:set', 'ratelimit.protection.enabled', '--value=false', '--type=boolean'], { verbose: true })

await configureNextcloud(['end_to_end_encryption'])

// Idle to wait for shutdown
while (true) {
	await new Promise((resolve) => setTimeout(resolve, 5000))
}
